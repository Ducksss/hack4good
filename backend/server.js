const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store (replace with MongoDB in production)
let activities = [];
let tasks = [
    { id: 1, name: 'Morning Medication', time: '08:00', completed: false },
    { id: 2, name: 'Breakfast', time: '09:00', completed: false },
    { id: 3, name: 'Drink Water', time: '10:00', completed: false },
    { id: 4, name: 'Lunch', time: '12:00', completed: false },
    { id: 5, name: 'Afternoon Medication', time: '14:00', completed: false },
    { id: 6, name: 'Dinner', time: '18:00', completed: false },
];

let patientStatus = {
    isActive: true,
    lastActivity: new Date().toISOString(),
    location: { lat: 1.3521, lng: 103.8198 }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all activities
app.get('/api/activities', (req, res) => {
    res.json(activities);
});

// Log a new activity (called by AI service)
app.post('/api/activities', (req, res) => {
    const { type, message, confidence } = req.body;
    const activity = {
        id: Date.now(),
        type,
        message,
        confidence,
        timestamp: new Date().toISOString(),
        status: type === 'fall' ? 'danger' : 'success'
    };
    activities.unshift(activity);

    // Update patient status
    patientStatus.lastActivity = activity.timestamp;

    // Auto-complete matching task
    if (type === 'medication') {
        const task = tasks.find(t => t.name.toLowerCase().includes('medication') && !t.completed);
        if (task) task.completed = true;
    } else if (type === 'meal' || type === 'eating') {
        const now = new Date().getHours();
        let mealName = now < 11 ? 'Breakfast' : now < 15 ? 'Lunch' : 'Dinner';
        const task = tasks.find(t => t.name === mealName && !t.completed);
        if (task) task.completed = true;
    } else if (type === 'hydration' || type === 'drinking') {
        const task = tasks.find(t => t.name.includes('Water') && !t.completed);
        if (task) task.completed = true;
    }

    console.log(`[ACTIVITY] ${type}: ${message}`);
    res.json(activity);
});

// Get tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// Update task completion
app.patch('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    const task = tasks.find(t => t.id === parseInt(id));
    if (task) {
        task.completed = completed;
        res.json(task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// Get patient status
app.get('/api/patient/status', (req, res) => {
    const completedTasks = tasks.filter(t => t.completed).length;
    res.json({
        ...patientStatus,
        tasksCompleted: completedTasks,
        totalTasks: tasks.length,
        progress: Math.round((completedTasks / tasks.length) * 100)
    });
});

// Update patient location
app.post('/api/patient/location', (req, res) => {
    const { lat, lng } = req.body;
    patientStatus.location = { lat, lng };
    res.json(patientStatus.location);
});

// Fall alert endpoint
app.post('/api/alerts/fall', (req, res) => {
    const alert = {
        id: Date.now(),
        type: 'fall',
        message: 'FALL DETECTED! Emergency services notified.',
        timestamp: new Date().toISOString(),
        status: 'danger'
    };
    activities.unshift(alert);
    console.log('[ALERT] FALL DETECTED!');
    res.json({ alert, emergencyNotified: true });
});

// Get weekly summary
app.get('/api/summary/weekly', (req, res) => {
    // Simulated weekly summary
    res.json({
        medicationAdherence: 95,
        mealsCompleted: 18,
        mealsMissed: 3,
        hydrationEvents: 42,
        fallIncidents: 0,
        trends: [
            { type: 'warning', message: 'Patient has been consistently skipping lunch' }
        ],
        generatedAt: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
🌟 AgeWell Backend Server Running!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 API: http://localhost:${PORT}
📋 Health: http://localhost:${PORT}/api/health

Endpoints:
  GET  /api/activities      - Get activity log
  POST /api/activities      - Log new activity
  GET  /api/tasks           - Get daily tasks
  PATCH /api/tasks/:id      - Update task
  GET  /api/patient/status  - Get patient status
  POST /api/alerts/fall     - Trigger fall alert
  GET  /api/summary/weekly  - Get weekly summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});
