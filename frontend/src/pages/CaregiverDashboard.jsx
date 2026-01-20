import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function CaregiverDashboard() {
    const [activities, setActivities] = useState([
        { id: 1, type: 'medication', message: 'Took morning medication', time: '08:15 AM', status: 'success' },
        { id: 2, type: 'meal', message: 'Had breakfast', time: '09:30 AM', status: 'success' },
        { id: 3, type: 'hydration', message: 'Drank water', time: '10:45 AM', status: 'success' },
        { id: 4, type: 'alert', message: 'Missed lunch reminder', time: '12:30 PM', status: 'warning' },
    ])

    const [tasks, setTasks] = useState([
        { id: 1, name: 'Morning Medication', time: '08:00', completed: true },
        { id: 2, name: 'Breakfast', time: '09:00', completed: true },
        { id: 3, name: 'Drink Water', time: '10:00', completed: true },
        { id: 4, name: 'Lunch', time: '12:00', completed: false },
        { id: 5, name: 'Afternoon Medication', time: '14:00', completed: false },
        { id: 6, name: 'Dinner', time: '18:00', completed: false },
    ])

    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    // Simulate receiving an alert
    const simulateAlert = (message) => {
        setAlertMessage(message)
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 5000)
    }

    const patientLocation = [1.3521, 103.8198] // Singapore coordinates
    const completedTasks = tasks.filter(t => t.completed).length
    const progress = (completedTasks / tasks.length) * 100

    const getActivityIcon = (type) => {
        switch (type) {
            case 'medication': return '💊'
            case 'meal': return '🍽️'
            case 'hydration': return '💧'
            case 'fall': return '🚨'
            case 'alert': return '⚠️'
            case 'navigation': return '🗺️'
            default: return '📋'
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
            case 'warning': return 'bg-amber-500/20 border-amber-500/30 text-amber-400'
            case 'danger': return 'bg-red-500/20 border-red-500/30 text-red-400'
            default: return 'bg-slate-500/20 border-slate-500/30 text-slate-400'
        }
    }

    return (
        <div className="min-h-screen p-6">
            {/* Alert Banner */}
            {showAlert && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
                    <div className="bg-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-red-500/50 flex items-center gap-4">
                        <span className="text-3xl">🚨</span>
                        <span className="text-xl font-bold">{alertMessage}</span>
                        <button onClick={() => setShowAlert(false)} className="ml-4 text-2xl">✕</button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Caregiver Dashboard</h1>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700">
                        <p className="text-slate-400 mb-2">Patient Status</p>
                        <p className="text-2xl font-bold text-emerald-400">✓ Active & Safe</p>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700">
                        <p className="text-slate-400 mb-2">Tasks Completed</p>
                        <p className="text-2xl font-bold text-white">{completedTasks} / {tasks.length}</p>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700">
                        <p className="text-slate-400 mb-2">Last Activity</p>
                        <p className="text-2xl font-bold text-indigo-400">10:45 AM</p>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700">
                        <p className="text-slate-400 mb-2">Alerts Today</p>
                        <p className="text-2xl font-bold text-amber-400">1 Warning</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity Timeline */}
                    <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Activity Timeline</h2>
                            <button
                                onClick={() => simulateAlert('Fall Detected! Check on patient immediately.')}
                                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm"
                            >
                                Simulate Fall Alert
                            </button>
                        </div>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {activities.map(activity => (
                                <div
                                    key={activity.id}
                                    className={`flex items-center gap-4 p-4 rounded-xl border ${getStatusColor(activity.status)}`}
                                >
                                    <span className="text-3xl">{getActivityIcon(activity.type)}</span>
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{activity.message}</p>
                                        <p className="text-sm text-slate-400">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Daily Checklist */}
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-4">Daily Checklist</h2>
                        <div className="mb-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-slate-400">Progress</span>
                                <span className="text-indigo-400 font-bold">{Math.round(progress)}%</span>
                            </div>
                            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            {tasks.map(task => (
                                <div
                                    key={task.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl ${task.completed ? 'bg-emerald-500/10' : 'bg-slate-700/30'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${task.completed ? 'bg-emerald-500' : 'bg-slate-600'
                                        }`}>
                                        {task.completed && <span className="text-white text-sm">✓</span>}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-medium ${task.completed ? 'text-emerald-400' : 'text-white'}`}>
                                            {task.name}
                                        </p>
                                    </div>
                                    <span className="text-sm text-slate-400">{task.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Location Map */}
                <div className="mt-8 bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700">
                    <h2 className="text-xl font-bold text-white mb-4">📍 Patient Location</h2>
                    <div className="h-64 rounded-xl overflow-hidden">
                        <MapContainer
                            center={patientLocation}
                            zoom={15}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />
                            <Marker position={patientLocation}>
                                <Popup>Patient's current location</Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>

                {/* Medical Summary */}
                <div className="mt-8 bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700">
                    <h2 className="text-xl font-bold text-white mb-4">📋 Weekly Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30">
                            <p className="text-emerald-400 font-bold text-2xl">95%</p>
                            <p className="text-slate-400">Medication Adherence</p>
                        </div>
                        <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/30">
                            <p className="text-amber-400 font-bold text-2xl">3 Missed</p>
                            <p className="text-slate-400">Meals This Week</p>
                        </div>
                        <div className="bg-indigo-500/10 rounded-xl p-4 border border-indigo-500/30">
                            <p className="text-indigo-400 font-bold text-2xl">0</p>
                            <p className="text-slate-400">Fall Incidents</p>
                        </div>
                    </div>
                    <p className="mt-4 text-slate-400 text-sm">
                        <strong className="text-amber-400">Trend detected:</strong> Patient has been skipping lunch consistently. Consider adjusting reminder times.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CaregiverDashboard
