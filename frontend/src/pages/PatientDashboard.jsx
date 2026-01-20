import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function PatientDashboard() {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [tasks, setTasks] = useState([
        { id: 1, name: 'Morning Medication', time: '08:00', completed: true, icon: '💊' },
        { id: 2, name: 'Breakfast', time: '09:00', completed: true, icon: '🍳' },
        { id: 3, name: 'Drink Water', time: '10:00', completed: false, icon: '💧' },
        { id: 4, name: 'Lunch', time: '12:00', completed: false, icon: '🥗' },
        { id: 5, name: 'Afternoon Medication', time: '14:00', completed: false, icon: '💊' },
        { id: 6, name: 'Dinner', time: '18:00', completed: false, icon: '🍽️' },
    ])

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const completedCount = tasks.filter(t => t.completed).length
    const progress = (completedCount / tasks.length) * 100

    return (
        <div className="min-h-screen p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                        Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}! 👋
                    </h1>
                    <p className="text-2xl text-slate-400">
                        {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-4xl font-mono text-indigo-400 mt-2">
                        {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>

                {/* Quick Actions - Large Accessible Buttons */}
                <div className="grid grid-cols-2 gap-6 mb-10">
                    <button
                        className="p-8 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                        onClick={() => {
                            alert('🏠 Navigation Started!\n\nFollow the directions to go home safely.')
                        }}
                    >
                        <span className="text-6xl mb-4 block">🏠</span>
                        <span className="text-2xl font-bold text-white block">Guide Me Home</span>
                    </button>

                    <button
                        className="p-8 rounded-3xl bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95"
                        onClick={() => {
                            alert('🆘 Help Request Sent!\n\nYour caregiver has been notified with your location.')
                        }}
                    >
                        <span className="text-6xl mb-4 block">🆘</span>
                        <span className="text-2xl font-bold text-white block">I Need Help</span>
                    </button>
                </div>

                {/* Today's Progress */}
                <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 mb-8 border border-slate-700">
                    <h2 className="text-2xl font-bold text-white mb-4">Today's Tasks</h2>
                    <div className="mb-6">
                        <div className="flex justify-between mb-2">
                            <span className="text-slate-400">Progress</span>
                            <span className="text-indigo-400 font-bold">{completedCount}/{tasks.length} completed</span>
                        </div>
                        <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Task List */}
                    <div className="space-y-4">
                        {tasks.map(task => (
                            <div
                                key={task.id}
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${task.completed
                                        ? 'bg-emerald-500/20 border border-emerald-500/30'
                                        : 'bg-slate-700/50 border border-slate-600'
                                    }`}
                            >
                                <span className="text-4xl">{task.icon}</span>
                                <div className="flex-1">
                                    <p className={`text-xl font-medium ${task.completed ? 'text-emerald-400 line-through' : 'text-white'}`}>
                                        {task.name}
                                    </p>
                                    <p className="text-slate-400">{task.time}</p>
                                </div>
                                {task.completed && (
                                    <span className="text-3xl">✅</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-6 text-center">
                    <p className="text-lg text-red-400 mb-2">Emergency Contact</p>
                    <p className="text-2xl font-bold text-white">Call Caregiver: 📞 +1 (555) 123-4567</p>
                </div>
            </div>
        </div>
    )
}

export default PatientDashboard
