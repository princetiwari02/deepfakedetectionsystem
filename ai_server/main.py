import os
import cv2
import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
import numpy as np
import tempfile
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
from ultralytics import YOLO

# ── Setup ──────────────────────────────────────────────────
app = FastAPI(title="DeepGuard AI Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = r"C:\Users\Dell\Desktop\new\ai_server\model_fixed.pt"

print(f"Running on: {DEVICE}")

# ── Load Swin Transformer ──────────────────────────────────
swin = models.swin_t(weights=None)
swin.head = nn.Linear(swin.head.in_features, 2)

checkpoint = torch.load(MODEL_PATH, map_location=DEVICE, weights_only=False)

# The saved file is a full model object, not just weights
if isinstance(checkpoint, dict):
    swin.load_state_dict(checkpoint)
else:
    swin = checkpoint

swin = swin.to(DEVICE)
swin.eval()
print("✅ Swin model loaded")

# ── Load YOLO ──────────────────────────────────────────────
yolo = YOLO("yolov8n.pt")
print("✅ YOLO loaded")

# ── Transform (same as training) ───────────────────────────
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.GaussianBlur(kernel_size=3),
    transforms.Grayscale(num_output_channels=3),
    transforms.ToTensor(),
    transforms.Normalize([0.5]*3, [0.5]*3)
])

# ── Helper Functions ───────────────────────────────────────
def extract_face(frame):
    results = yolo(frame, verbose=False)
    if len(results[0].boxes) == 0:
        return None
    boxes = results[0].boxes.xyxy.cpu().numpy()
    areas = [(x2-x1)*(y2-y1) for x1,y1,x2,y2 in boxes]
    x1, y1, x2, y2 = map(int, boxes[np.argmax(areas)])
    face = frame[y1:y2, x1:x2]
    return face if face.size > 0 else None

def predict_face(face_bgr):
    face_rgb = cv2.cvtColor(face_bgr, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(face_rgb)
    inp = transform(img).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        out = swin(inp)
        prob = torch.softmax(out, dim=1)[0, 1].item()
    return prob

# ── Routes ─────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "DeepGuard AI Server is running ✅"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
async def predict(video: UploadFile = File(...)):
    suffix = os.path.splitext(video.filename)[1] or ".mp4"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await video.read())
        tmp_path = tmp.name

    try:
        cap = cv2.VideoCapture(tmp_path)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        step = max(1, total_frames // 30)

        probs = []
        frame_idx = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            if frame_idx % step == 0:
                face = extract_face(frame)
                if face is not None:
                    probs.append(predict_face(face))
            frame_idx += 1

        cap.release()

        if not probs:
            return JSONResponse({
                "label": "REAL",
                "confidence": 50.0,
                "framesAnalyzed": 0,
                "note": "No face detected in video"
            })

        avg_prob = float(np.mean(probs))
        label = "FAKE" if avg_prob >= 0.35 else "REAL"
        confidence = round(
            avg_prob * 100 if label == "FAKE" else (1 - avg_prob) * 100, 2
        )

        return {
            "label": label,
            "confidence": confidence,
            "framesAnalyzed": len(probs)
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

    finally:
        os.unlink(tmp_path)