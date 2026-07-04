import os
import sys
import subprocess

def install_and_import(package):
    try:
        import cv2
    except ImportError:
        print(f"Installing {package}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        import cv2
    return cv2

cv2 = install_and_import('opencv-python')

video_path = r"D:\HK WEBSITE\01.mp4"
output_dir = r"D:\HK WEBSITE\frontend\public\images\frames"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Open video file
cap = cv2.VideoCapture(video_path)
if not cap.isOpened():
    print("Error opening video stream or file")
    sys.exit(1)

frame_count = 0
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    
    frame_name = f"frame_{frame_count:04d}.jpg"
    frame_path = os.path.join(output_dir, frame_name)
    # Save frame with high quality
    cv2.imwrite(frame_path, frame, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
    frame_count += 1

cap.release()
print(f"Successfully extracted {frame_count} frames to {output_dir}")
