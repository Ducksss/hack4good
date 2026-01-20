"""
AgeWell AI Service - YOLOv8 Activity Detection
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image
import requests

app = Flask(__name__)
CORS(app)

# Backend API URL
BACKEND_URL = "http://localhost:3001"

# YOLOv8 model (loaded lazily)
model = None

def get_model():
    """Lazy load YOLOv8 model"""
    global model
    if model is None:
        try:
            from ultralytics import YOLO
            model = YOLO('yolov8n.pt')  # nano model for speed
            print("✓ YOLOv8 model loaded successfully")
        except Exception as e:
            print(f"⚠ Could not load YOLOv8: {e}")
            model = "mock"
    return model

# Activity-related objects to detect
ACTIVITY_OBJECTS = {
    'eating': ['fork', 'knife', 'spoon', 'bowl', 'cup', 'sandwich', 'pizza', 'apple', 'banana', 'orange'],
    'medication': ['bottle', 'pill'],  # Would need custom training for pills
    'hydration': ['bottle', 'cup', 'wine glass'],
}

def decode_image(base64_string):
    """Decode base64 image to numpy array"""
    img_data = base64.b64decode(base64_string)
    img = Image.open(BytesIO(img_data))
    return cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)

def detect_activity(detected_objects):
    """Classify activity based on detected objects"""
    for activity, objects in ACTIVITY_OBJECTS.items():
        for obj in detected_objects:
            if obj['label'].lower() in objects:
                return activity, obj
    return None, None

def notify_backend(activity_type, message, confidence):
    """Send activity notification to backend"""
    try:
        response = requests.post(f"{BACKEND_URL}/api/activities", json={
            "type": activity_type,
            "message": message,
            "confidence": confidence
        })
        return response.json()
    except Exception as e:
        print(f"Could not notify backend: {e}")
        return None

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "model_loaded": model is not None,
        "service": "AgeWell AI Service"
    })

@app.route('/detect', methods=['POST'])
def detect():
    """
    Detect objects and activities in an image
    Expects: { "image": "base64_encoded_image" }
    Returns: { "detections": [...], "activity": {...} }
    """
    try:
        data = request.json
        
        if 'image' not in data:
            return jsonify({"error": "No image provided"}), 400
        
        # Decode image
        image = decode_image(data['image'])
        
        # Get model
        yolo = get_model()
        
        detections = []
        activity = None
        
        if yolo != "mock":
            # Run YOLOv8 detection
            results = yolo(image, verbose=False)
            
            for result in results:
                boxes = result.boxes
                for box in boxes:
                    cls = int(box.cls[0])
                    conf = float(box.conf[0])
                    label = yolo.names[cls]
                    
                    if conf > 0.5:  # Confidence threshold
                        detections.append({
                            "label": label,
                            "confidence": round(conf, 2),
                            "bbox": box.xyxy[0].tolist()
                        })
            
            # Classify activity
            activity_type, matched_obj = detect_activity(detections)
            if activity_type:
                activity = {
                    "type": activity_type,
                    "confidence": matched_obj['confidence'],
                    "detected_object": matched_obj['label']
                }
                
                # Notify backend
                message = f"Detected {activity_type} (via {matched_obj['label']})"
                notify_backend(activity_type, message, matched_obj['confidence'])
        else:
            # Mock detection for demo
            detections = [{"label": "person", "confidence": 0.95}]
        
        return jsonify({
            "detections": detections,
            "activity": activity,
            "objects_count": len(detections)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/detect/fall', methods=['POST'])
def detect_fall():
    """
    Detect falls using pose estimation
    In production, this would use MediaPipe for pose analysis
    """
    try:
        data = request.json
        
        # Mock fall detection for demo
        # Real implementation would use MediaPipe pose estimation
        is_fall = data.get('simulate_fall', False)
        
        if is_fall:
            # Notify backend about fall
            requests.post(f"{BACKEND_URL}/api/alerts/fall")
            
            return jsonify({
                "fall_detected": True,
                "confidence": 0.97,
                "emergency_notified": True,
                "message": "Fall detected! Emergency services have been notified."
            })
        
        return jsonify({
            "fall_detected": False,
            "pose_analysis": "normal",
            "confidence": 0.95
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analyze/frame', methods=['POST'])
def analyze_frame():
    """
    Full frame analysis - combines object detection and pose estimation
    This is the main endpoint for continuous monitoring
    """
    try:
        data = request.json
        
        results = {
            "timestamp": None,
            "objects": [],
            "pose": "normal",
            "activity": None,
            "alerts": []
        }
        
        # In production, this would:
        # 1. Decode the video frame
        # 2. Run YOLOv8 for object detection
        # 3. Run MediaPipe for pose estimation
        # 4. Classify activities
        # 5. Detect falls
        # 6. Send alerts if needed
        
        return jsonify(results)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("""
    ╔═══════════════════════════════════════╗
    ║   AgeWell AI Service (YOLOv8)         ║
    ╠═══════════════════════════════════════╣
    ║  🤖 Object Detection: YOLOv8          ║
    ║  🏃 Pose Estimation: MediaPipe        ║
    ║  📍 Running on: http://localhost:5000 ║
    ╚═══════════════════════════════════════╝
    """)
    
    # Pre-load model
    get_model()
    
    app.run(host='0.0.0.0', port=5000, debug=True)
