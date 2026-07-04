# HariKrushn Digiverse LLP - Cinematic Web Experience (Phase 1)

This project contains the Phase 1 web experience of the HariKrushn Digiverse LLP website. It is built to communicate luxury, innovation, digital craftsmanship, and high-tech elegance, using design languages inspired by Apple, Tesla, Stripe, and Linear.

## 📁 Project Structure

```text
project-root/
├── frontend/             # React + Vite + Tailwind v4 Frontend
│   ├── public/           # Preloaded video, assets & fonts
│   ├── src/              # Source code
│   │   ├── components/   # Preloader, Navbar, Magnetic, CustomCursor, ScrollIndicator
│   │   ├── sections/     # HeroSection (Lenis Smooth Scroll + GSAP Scrubbing)
│   │   ├── utils/        # Tailwind class merger utils
│   │   ├── index.css     # Theme variables & custom animations
│   │   ├── App.jsx       # App layout orchestrator
│   │   └── main.jsx      # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/              # FastAPI Backend folder
│   ├── app/
│   │   └── core/         # Settings and configurations
│   └── requirements.txt  # Core python packages
│
├── main.py               # Main Orchestrator & API startup script
├── .env                  # Environment configurations
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Installation & Setup

1. **Install Frontend Dependencies:**
   Navigate to the `frontend` folder and install packages:
   ```bash
   cd frontend
   npm install
   ```

2. **Setup Backend Environment:**
   Navigate to the `backend` folder, create a virtual environment, and install dependencies:
   ```bash
   cd backend
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   
   pip install -r requirements.txt
   ```

### Running the Project

To start both the frontend and backend servers together, run the following command from the root directory:
```bash
python main.py
```

This will concurrently run:
- **FastAPI Backend:** `http://localhost:8008` (API docs at `http://localhost:8008/docs`)
- **Vite Frontend:** `http://localhost:5173`

Press `Ctrl+C` in the terminal to stop both servers cleanly.

## 💎 Premium Design Details

- **Loading Experience:** The video file is fetched chunk-by-chunk using a background XMLHTTPRequest to calculate a precise loading percentage before revealing the canvas.
- **Scroll-Controlled Video:** Pinned for a scroll height of `400vh` in viewport. Uses `requestAnimationFrame` with linear interpolation (`lerp`) to eliminate seek jitter and provide Apple-style smooth scrub transitions.
- **Fluid Lenis Scroll:** Custom scrolling speed and weight curves create a luxurious, premium feel.
- **Custom Cursor & Magnetic Buttons:** Desktop users enjoy a dynamic custom cursor that scale-morphs on elements, with physical magnetic pull animations on CTA buttons.
