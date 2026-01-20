import { useState, useRef, useEffect } from 'react'

function CameraView() {
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const [isStreaming, setIsStreaming] = useState(false)
    const [detections, setDetections] = useState([])
    const [lastActivity, setLastActivity] = useState(null)
    const [alertHistory, setAlertHistory] = useState([])

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 }
            })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                setIsStreaming(true)
            }
        } catch (err) {
            console.error('Error accessing camera:', err)
            alert('Unable to access camera. Please ensure camera permissions are granted.')
        }
    }

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop())
            setIsStreaming(false)
        }
    }

    // Simulate YOLOv8 detection (in real app, this would call the Flask API)
    const simulateDetection = (type) => {
        const detectionTypes = {
            eating: { label: 'Person Eating', confidence: 0.94, color: '#10b981', icon: '🍽️' },
            medication: { label: 'Taking Medication', confidence: 0.89, color: '#8b5cf6', icon: '💊' },
            drinking: { label: 'Drinking Water', confidence: 0.92, color: '#3b82f6', icon: '💧' },
            fall: { label: '⚠️ FALL DETECTED', confidence: 0.97, color: '#ef4444', icon: '🚨' },
        }

        const detection = detectionTypes[type]
        const newActivity = {
            ...detection,
            timestamp: new Date().toLocaleTimeString(),
            type
        }

        setLastActivity(newActivity)
        setDetections([detection])
        setAlertHistory(prev => [newActivity, ...prev.slice(0, 9)])

        // Show window alert
        if (type === 'fall') {
            alert('🚨 FALL DETECTED!\n\nEmergency services have been notified.\nCaregiver has been alerted.')
        } else {
            alert(`✅ Activity Detected: ${detection.label}\n\nCaregiver dashboard has been updated.`)
        }

        // Clear detection after 3 seconds
        setTimeout(() => setDetections([]), 3000)
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">📹 YOLOv8 Activity Detection</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Camera Feed */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-white">Live Camera Feed</h2>
                                <div className="flex gap-3">
                                    {!isStreaming ? (
                                        <button
                                            onClick={startCamera}
                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium"
                                        >
                                            Start Camera
                                        </button>
                                    ) : (
                                        <button
                                            onClick={stopCamera}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-medium"
                                        >
                                            Stop Camera
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Video Container */}
                            <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                                <canvas
                                    ref={canvasRef}
                                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                />

                                {!isStreaming && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <span className="text-6xl mb-4 block">📷</span>
                                            <p className="text-slate-400">Click "Start Camera" to begin</p>
                                        </div>
                                    </div>
                                )}

                                {/* Detection Overlay */}
                                {detections.length > 0 && (
                                    <div className="absolute top-4 left-4 right-4">
                                        {detections.map((det, idx) => (
                                            <div
                                                key={idx}
                                                className="px-4 py-2 rounded-lg mb-2 font-bold text-white animate-pulse"
                                                style={{ backgroundColor: det.color }}
                                            >
                                                {det.icon} {det.label} ({Math.round(det.confidence * 100)}%)
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Simulation Controls */}
                            <div className="mt-6">
                                <p className="text-slate-400 mb-3">Simulate YOLOv8 Detection:</p>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => simulateDetection('eating')}
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white"
                                    >
                                        🍽️ Detect Eating
                                    </button>
                                    <button
                                        onClick={() => simulateDetection('medication')}
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white"
                                    >
                                        💊 Detect Medication
                                    </button>
                                    <button
                                        onClick={() => simulateDetection('drinking')}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
                                    >
                                        💧 Detect Drinking
                                    </button>
                                    <button
                                        onClick={() => simulateDetection('fall')}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white"
                                    >
                                        🚨 Simulate Fall
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity Log */}
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-4">Activity Log</h2>

                        {/* Current Detection */}
                        {lastActivity && (
                            <div className="mb-6 p-4 rounded-xl bg-indigo-500/20 border border-indigo-500/30">
                                <p className="text-indigo-400 text-sm mb-1">Latest Detection</p>
                                <p className="text-xl font-bold text-white">{lastActivity.icon} {lastActivity.label}</p>
                                <p className="text-slate-400 text-sm">{lastActivity.timestamp}</p>
                            </div>
                        )}

                        {/* History */}
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {alertHistory.length === 0 ? (
                                <p className="text-slate-500 text-center py-8">No activities detected yet</p>
                            ) : (
                                alertHistory.map((activity, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-3 rounded-lg border ${activity.type === 'fall'
                                                ? 'bg-red-500/20 border-red-500/30'
                                                : 'bg-slate-700/30 border-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{activity.icon}</span>
                                            <span className="text-white font-medium">{activity.label}</span>
                                        </div>
                                        <p className="text-slate-400 text-sm mt-1">{activity.timestamp}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* YOLOv8 Info Card */}
                <div className="mt-8 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 border border-indigo-500/30">
                    <h3 className="text-xl font-bold text-white mb-3">🤖 How YOLOv8 Detection Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300">
                        <div>
                            <p className="font-bold text-indigo-400 mb-1">Object Detection</p>
                            <p className="text-sm">YOLOv8 identifies objects like food, pills, water bottles in real-time video frames.</p>
                        </div>
                        <div>
                            <p className="font-bold text-purple-400 mb-1">Pose Estimation</p>
                            <p className="text-sm">MediaPipe tracks body posture to detect falls and monitor movement patterns.</p>
                        </div>
                        <div>
                            <p className="font-bold text-pink-400 mb-1">Activity Classification</p>
                            <p className="text-sm">Combining object + pose data to classify activities: eating, taking pills, drinking water.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CameraView
