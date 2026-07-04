import sys
import os
import json
import subprocess
import threading
import time
import shutil
import datetime
try:
    import cv2
except ImportError:
    cv2 = None

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

try:
    from pymongo import MongoClient
except ImportError:
    MongoClient = None

# 1. Setup backend import path and load environment variables
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
os.environ["PYTHONPATH"] = backend_dir + os.pathsep + os.environ.get("PYTHONPATH", "")

load_dotenv()  # Loads .env from the root directory

from app.core.config import settings

# 2. Define FastAPI Application
app = FastAPI(
    title="HariKrushn Digiverse API",
    description="API Backend for HariKrushn Digiverse LLP Platform",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for admin auth and content
class VerifyRequest(BaseModel):
    password: str

class ContentUpdateRequest(BaseModel):
    password: str
    content: dict

# Define the absolute path for content.json (located in backend/)
CONTENT_FILE = os.path.join(backend_dir, "content.json")

# Default hardcoded content representing original site data
DEFAULT_CONTENT = {
    "hero": {
        "label": "// EST. 2019 — A DIGITAL ATELIER",
        "title1": "Architecting the",
        "title2": "infinite digital.",
        "desc": "HariKrushn DigiVerse is an engineering & design partnership building custom software, AI systems and digital brand presence for ambitious global teams."
    },
    "stats": [
        { "value": "140+", "label": "Projects Shipped" },
        { "value": "46", "label": "Engineers" },
        { "value": "18", "label": "Countries Served" },
        { "value": "98%", "label": "Client Retention" }
    ],
    "services": [
        {
            "num": "01/07",
            "title": "Web Engineering",
            "desc": "Creating high-fidelity, cinematic, and fast-loading web applications that captivate and convert.",
            "tags": ["FRONTEND", "DESIGN"],
            "href": "#service-web"
        },
        {
            "num": "02/07",
            "title": "Mobile Applications",
            "desc": "Building bespoke native-feeling iOS and Android solutions with fluid gestures and offline sync.",
            "tags": ["IOS", "ANDROID"],
            "href": "#service-app"
        },
        {
            "num": "03/07",
            "title": "Custom Software",
            "desc": "Constructing robust backend panels, CRM matrices, SaaS dashboards, and multi-tenant systems.",
            "tags": ["CRM", "ERP"],
            "href": "#service-custom-software"
        },
        {
            "num": "04/07",
            "title": "Digital Marketing",
            "desc": "Driving traffic and client acquisitions using data-backed strategies, SEO, and paid ads.",
            "tags": ["SEO", "GROWTH"],
            "href": "#service-digital-marketing"
        },
        {
            "num": "05/07",
            "title": "Social Media Management",
            "desc": "Crafting brand presence, graphic design guides, and content calendars to elevate recognition.",
            "tags": ["BRANDING", "CONTENT"],
            "href": "#service-social-media-management"
        },
        {
            "num": "06/07",
            "title": "AI Consulting",
            "desc": "Developing automated AI agents, vector database search pipelines, and custom LLM integrations.",
            "tags": ["LLM", "AGENTS"],
            "href": "#service-ai-consulting"
        },
        {
            "num": "07/07",
            "title": "IT Consulting",
            "desc": "Designing Cloud migrations, Docker orchestration files, hardened security, and CI/CD pipelines.",
            "tags": ["CLOUD", "DEVOPS"],
            "href": "#service-it-consulting"
        }
    ],
    "caseStudy": {
        "title": "Quantum Banking OS",
        "desc": "Re-architecting the core infrastructure for a leading European fintech. We replaced legacy monolithic systems with a high-concurrency microservices mesh capable of processing millions of transactions per second.",
        "metric1Value": "+340%",
        "metric1Label": "Throughput",
        "metric2Value": "$12M",
        "metric2Label": "Infra Saved",
        "image": "/images/quantum_banking.png"
    },
    "sectors": ["FINTECH", "HEALTHTECH", "E-COMMERCE", "LOGISTICS", "EDTECH", "REAL ESTATE", "SAAS", "HOSPITALITY"],
    "milestones": [
        {
            "year": "2024",
            "title": "Digital Craftsmanship Leader",
            "description": "Established a premium reputation in cinematic web engineering, high-end AI automation integrations, and luxury UI design."
        },
        {
            "year": "2023",
            "title": "Scaling Enterprise Systems",
            "description": "Expanded capabilities to construct complex custom CRMs, cloud architectures, and deep AI-driven process automations for global businesses."
        },
        {
            "year": "2022",
            "title": "The Growth Phase",
            "description": "Built a team of elite designers and developers. Delivered over 50 custom websites, creating immersive user interfaces that set new industry standards."
        },
        {
            "year": "2021",
            "title": "The Spark of Innovation",
            "description": "HariKrushn Digiverse LLP was founded with a single mission: to merge fine design aesthetics with robust software engineering."
        }
    ],
    "gallery": [
        { "title": "The Digiverse Workspace", "category": "Studio", "size": "col-span-2 row-span-1", "image": "/images/gallery/digiverse_workspace.png" },
        { "title": "Design Sprint Session", "category": "Team", "size": "col-span-1 row-span-1", "image": "/images/gallery/design_sprint.png" },
        { "title": "Hardware Calibration", "category": "Equipment", "size": "col-span-1 row-span-2", "image": "/images/gallery/hardware_calibration.png" },
        { "title": "AI Orchestrator Architecture", "category": "Engineering", "size": "col-span-2 row-span-1", "image": "/images/gallery/ai_orchestrator.png" },
        { "title": "Cinematic Review", "category": "Studio", "size": "col-span-1 row-span-1", "image": "/images/gallery/cinematic_review.png" },
        { "title": "Launch Celebration", "category": "Team", "size": "col-span-2 row-span-1", "image": "/images/gallery/launch_celebration.png" }
    ]
}

# MongoDB connection cache
mongo_client = None
mongo_db = None
mongo_collection = None

def get_mongo_collection():
    global mongo_client, mongo_db, mongo_collection
    if mongo_collection is not None:
        return mongo_collection
        
    if MongoClient is None:
        print("[MongoDB] pymongo is not installed. Using local JSON fallback.")
        return None
        
    uri = os.getenv("MONGODB_URI")
    if not uri:
        print("[MongoDB] MONGODB_URI not found in env. Using local JSON fallback.")
        return None
        
    try:
        # Connect to MongoDB with 5s timeout
        mongo_client = MongoClient(uri, serverSelectionTimeoutMS=5000)
        # Verify connection
        mongo_client.admin.command('ping')
        mongo_db = mongo_client["hk_digiverse"]
        mongo_collection = mongo_db["site_content"]
        print("[MongoDB] Connected to MongoDB successfully!")
        return mongo_collection
    except Exception as e:
        print(f"[MongoDB] Connection failed: {e}. Using local JSON fallback.")
        mongo_client = None
        mongo_db = None
        mongo_collection = None
        return None

def get_mongo_history_collection():
    global mongo_client, mongo_db
    if mongo_db is not None:
        return mongo_db["content_history"]
    coll = get_mongo_collection()
    if coll is not None:
        return mongo_db["content_history"]
    return None

def load_content() -> dict:
    collection = get_mongo_collection()
    if collection is not None:
        try:
            # Check for published content
            doc = collection.find_one({"identifier": "website_content_published"})
            if not doc:
                # Compatibility check
                doc = collection.find_one({"identifier": "website_content"})
            if doc:
                content = dict(doc)
                content.pop("_id", None)
                content.pop("identifier", None)
                return content
            else:
                print("[MongoDB] Published document not found. Seeding...")
                local_data = load_local_content()
                try:
                    collection.insert_one({"identifier": "website_content_published", **local_data})
                    collection.insert_one({"identifier": "website_content", **local_data})
                    print("[MongoDB] Seeding completed.")
                except Exception as e:
                    print(f"[MongoDB] Seeding failed: {e}")
                return local_data
        except Exception as e:
            print(f"[MongoDB] Error loading published content: {e}. Using local fallback.")
    return load_local_content()

def load_draft() -> dict:
    collection = get_mongo_collection()
    if collection is not None:
        try:
            doc = collection.find_one({"identifier": "website_content_draft"})
            if doc:
                content = dict(doc)
                content.pop("_id", None)
                content.pop("identifier", None)
                return content
            else:
                # Seed draft with published content
                print("[MongoDB] Draft not found. Creating draft from published content...")
                published = load_content()
                try:
                    collection.replace_one(
                        {"identifier": "website_content_draft"},
                        {"identifier": "website_content_draft", **published},
                        upsert=True
                    )
                except Exception as e:
                    print(f"[MongoDB] Failed to write initial draft: {e}")
                return published
        except Exception as e:
            print(f"[MongoDB] Error loading draft: {e}. Using local fallback.")
    
    # Local fallback
    draft_file = os.path.join(backend_dir, "content_draft.json")
    if os.path.exists(draft_file):
        try:
            with open(draft_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return load_content()

def load_local_content() -> dict:
    if os.path.exists(CONTENT_FILE):
        try:
            with open(CONTENT_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error reading content.json: {e}")
    return DEFAULT_CONTENT

def save_draft_db(data: dict):
    # Save local backup
    draft_file = os.path.join(backend_dir, "content_draft.json")
    try:
        with open(draft_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print("[Local] Draft backup written successfully.")
    except Exception as e:
        print(f"[Local] Error writing local draft: {e}")
        
    # Save to MongoDB
    collection = get_mongo_collection()
    if collection is not None:
        try:
            result = collection.replace_one(
                {"identifier": "website_content_draft"},
                {"identifier": "website_content_draft", **data},
                upsert=True
            )
            print(f"[MongoDB] Draft saved (matched={result.matched_count}, modified={result.modified_count})")
        except Exception as e:
            print(f"[MongoDB] Error saving draft: {e}")

def publish_db(data: dict):
    # 1. Save locally
    save_local_content(data)
    
    # 2. Save to MongoDB
    collection = get_mongo_collection()
    if collection is not None:
        try:
            collection.replace_one(
                {"identifier": "website_content_published"},
                {"identifier": "website_content_published", **data},
                upsert=True
            )
            # Sync standard identifier
            collection.replace_one(
                {"identifier": "website_content"},
                {"identifier": "website_content", **data},
                upsert=True
            )
            print("[MongoDB] Published successfully.")
        except Exception as e:
            print(f"[MongoDB] Error publishing to db: {e}")
            
    # 3. Save to version history
    history_coll = get_mongo_history_collection()
    if history_coll is not None:
        try:
            version_doc = {
                "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
                "content": data
            }
            history_coll.insert_one(version_doc)
            print("[MongoDB] Version entry logged.")
        except Exception as e:
            print(f"[MongoDB] Error writing history: {e}")

def save_local_content(data: dict):
    try:
        with open(CONTENT_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print("[Local] Content backup written successfully.")
    except Exception as e:
        print(f"[Local] Error writing content: {e}")

# schemas for API
class AdminPasswordReq(BaseModel):
    password: str

class PublishRequest(BaseModel):
    password: str
    content: dict

class DraftRequest(BaseModel):
    password: str
    content: dict

class RestoreRequest(BaseModel):
    password: str
    version_id: str

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "HariKrushn Digiverse Core API",
        "version": "1.0.0"
    }

@app.get("/api/content")
async def get_site_content():
    return load_content()

@app.get("/api/content/draft")
async def get_draft_content():
    return load_draft()

@app.post("/api/content/draft")
async def update_draft_content(req: DraftRequest):
    admin_pass = os.getenv("ADMIN_PASSWORD", "admin123")
    if req.password != admin_pass:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    try:
        save_draft_db(req.content)
        return {"status": "success", "message": "Draft saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/content/publish")
async def publish_content(req: PublishRequest):
    admin_pass = os.getenv("ADMIN_PASSWORD", "admin123")
    if req.password != admin_pass:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    try:
        publish_db(req.content)
        # Sync draft workspace with published state
        save_draft_db(req.content)
        return {"status": "success", "message": "Content published successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/content/history")
async def get_content_history():
    history_coll = get_mongo_history_collection()
    if history_coll is not None:
        try:
            cursor = history_coll.find({}, {"_id": 0}).sort("timestamp", -1).limit(20)
            return list(cursor)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    return []

@app.post("/api/content/history/restore")
async def restore_content_version(req: RestoreRequest):
    admin_pass = os.getenv("ADMIN_PASSWORD", "admin123")
    if req.password != admin_pass:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    history_coll = get_mongo_history_collection()
    if history_coll is None:
        raise HTTPException(status_code=500, detail="Database not available")
        
    try:
        doc = history_coll.find_one({"timestamp": req.version_id})
        if not doc:
            raise HTTPException(status_code=404, detail="Version not found")
        content = doc["content"]
        save_draft_db(content)
        return {"status": "success", "message": f"Draft restored to version {req.version_id}", "content": content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload/image")
async def upload_image(file: UploadFile = File(...)):
    if not file.filename.lower().endswith((".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg")):
        raise HTTPException(status_code=400, detail="Only standard image files are allowed.")
        
    uploads_dir = os.path.join("frontend", "public", "images", "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    ext = os.path.splitext(file.filename)[1]
    image_filename = f"img_{timestamp}{ext}"
    image_path = os.path.join(uploads_dir, image_filename)
    
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    image_url = f"/images/uploads/{image_filename}"
    return {
        "status": "success",
        "imageUrl": image_url
    }

@app.post("/api/upload/video")
async def upload_video(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".mp4"):
        raise HTTPException(status_code=400, detail="Only MP4 video files are allowed.")
        
    uploads_dir = os.path.join("frontend", "public", "images", "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    video_filename = f"video_{timestamp}.mp4"
    video_path = os.path.join(uploads_dir, video_filename)
    
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Extract frames using OpenCV
    frames_dir = os.path.join("frontend", "public", "images", "frames")
    os.makedirs(frames_dir, exist_ok=True)
    
    # Clear old frames
    for filename in os.listdir(frames_dir):
        file_path = os.path.join(frames_dir, filename)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception:
            pass
            
    if cv2 is None:
        raise HTTPException(status_code=500, detail="OpenCV not loaded in Python backend.")
        
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise HTTPException(status_code=500, detail="Failed to open uploaded MP4 video.")
        
    frame_count = 0
    max_frames = 500
    
    while cap.isOpened() and frame_count < max_frames:
        ret, frame = cap.read()
        if not ret:
            break
        frame_name = f"frame_{frame_count:04d}.jpg"
        frame_path = os.path.join(frames_dir, frame_name)
        cv2.imwrite(frame_path, frame, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
        frame_count += 1
        
    cap.release()
    
    video_url = f"/images/uploads/{video_filename}"
    return {
        "status": "success",
        "videoUrl": video_url,
        "frameCount": frame_count
    }

@app.post("/api/auth/verify")
async def verify_auth(req: VerifyRequest):
    admin_pass = os.getenv("ADMIN_PASSWORD", "admin123")
    if req.password == admin_pass:
        return {"status": "success", "message": "Authentication successful"}
    raise HTTPException(status_code=401, detail="Invalid password")

@app.post("/api/content")
async def update_site_content(req: ContentUpdateRequest):
    admin_pass = os.getenv("ADMIN_PASSWORD", "admin123")
    if req.password != admin_pass:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    try:
        publish_db(req.content)
        save_draft_db(req.content)
        return {"status": "success", "message": "Content updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save content: {str(e)}")

# 3. Process Runner Orchestrator
if __name__ == "__main__":
    import signal

    print("\n" + "=" * 60)
    print("      HariKrushn Digiverse LLP - Service Orchestrator")
    print("=" * 60)

    # Determine Python executable
    def get_python_executable():
        paths = [
            os.path.join(backend_dir, "venv", "Scripts", "python.exe"),
            os.path.join(backend_dir, "venv", "bin", "python"),
        ]
        for p in paths:
            if os.path.exists(p):
                print(f"[System] Found virtual environment python: {p}")
                return p
        print(f"[System] Virtual environment python not found. Using system python: {sys.executable}")
        return sys.executable

    python_exe = get_python_executable()

    # Determine npm executable
    npm_cmd = "npm.cmd" if os.name == 'nt' else "npm"
    frontend_dir = os.path.join(os.path.dirname(__file__), "frontend")

    # Run build synchronously first
    print("[System] Generating frontend production build...")
    try:
        subprocess.run([npm_cmd, "run", "build"], cwd=frontend_dir, check=True, shell=(os.name == 'nt'))
        print("[System] Production build created successfully!")
    except Exception as e:
        print(f"[System] Warning: Production build failed ({e}). Starting dev services anyway...")

    # Define commands
    # Use reload, but ignore frontend files to prevent restart loops
    backend_port = os.getenv("PORT", "8008")
    frontend_port = os.getenv("FRONTEND_PORT", "5173")
    backend_cmd = [
        python_exe, "-m", "uvicorn", "main:app",
        "--host", "0.0.0.0",
        "--port", backend_port,
        "--reload"
    ]
    frontend_cmd = [npm_cmd, "run", "dev", "--", "--port", frontend_port]

    processes = []

    def log_stream(stream, prefix):
        try:
            for line in iter(stream.readline, ''):
                if line:
                    sys.stdout.write(f"{prefix} {line}")
                    sys.stdout.flush()
        except Exception:
            pass

    def run_service(cmd, cwd, prefix):
        # We start the process using shell=False for direct signals and cleaner shutdown
        p = subprocess.Popen(
            cmd,
            cwd=cwd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        processes.append(p)
        t = threading.Thread(target=log_stream, args=(p.stdout, prefix), daemon=True)
        t.start()
        return p

    def cleanup():
        print("\n[System] Shutting down all services...")
        for p in processes:
            try:
                if os.name == 'nt':
                    # Use taskkill on Windows to kill the process and its child processes cleanly
                    subprocess.run(
                        ["taskkill", "/F", "/T", "/PID", str(p.pid)],
                        stdout=subprocess.DEVNULL,
                        stderr=subprocess.DEVNULL
                    )
                else:
                    p.terminate()
            except Exception:
                pass

    # Register signals for graceful termination (non-Windows)
    try:
        signal.signal(signal.SIGINT, lambda sig, frame: sys.exit(0))
        signal.signal(signal.SIGTERM, lambda sig, frame: sys.exit(0))
    except Exception:
        pass

    try:
        print("[System] Starting Backend (FastAPI)...")
        backend_proc = run_service(backend_cmd, os.path.dirname(__file__), "[Backend]")

        print("[System] Starting Frontend (Vite)...")
        frontend_proc = run_service(frontend_cmd, os.path.join(os.path.dirname(__file__), "frontend"), "[Frontend]")

        print("\n" + "=" * 60)
        print(f"  - Backend:  http://localhost:{backend_port}")
        print(f"  - Frontend: http://localhost:{frontend_port}")
        print("  - CTRL+C to terminate both servers")
        print("=" * 60 + "\n")

        # Monitor processes
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print(f"[System] Backend stopped with code {backend_proc.returncode}")
                break
            if frontend_proc.poll() is not None:
                print(f"[System] Frontend stopped with code {frontend_proc.returncode}")
                break

    except KeyboardInterrupt:
        pass
    finally:
        cleanup()
