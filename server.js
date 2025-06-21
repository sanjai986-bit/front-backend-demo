const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.static('public')); // Serve static files from public directory

// In-memory database (for demo purposes)
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];
let nextId = 3;

// Routes

// GET /api/users - Get all users
app.get('/api/users', (req, res) => {
    console.log('GET /api/users - Fetching all users');
    res.json(users);
});

// GET /api/users/:id - Get a specific user
app.get('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    console.log(`GET /api/users/${id} - User found:`, user);
    res.json(user);
});

// POST /api/users - Create a new user
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    
    // Basic validation
    if (!name || !email) {
        return res.status(400).json({ 
            error: 'Name and email are required' 
        });
    }
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ 
            error: 'Email already exists' 
        });
    }
    
    // Create new user
    const newUser = {
        id: nextId++,
        name,
        email
    };
    
    users.push(newUser);
    console.log('POST /api/users - New user created:', newUser);
    
    res.status(201).json(newUser);
});

// PUT /api/users/:id - Update a user
app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user
    if (name) users[userIndex].name = name;
    if (email) users[userIndex].email = email;
    
    console.log(`PUT /api/users/${id} - User updated:`, users[userIndex]);
    res.json(users[userIndex]);
});

// DELETE /api/users/:id - Delete a user
app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    console.log(`DELETE /api/users/${id} - User deleted:`, deletedUser);
    
    res.json({ message: 'User deleted successfully', user: deletedUser });
});

// Serve the HTML file at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Frontend available at: http://localhost:${PORT}`);
    console.log(`🔗 API endpoints:`);
    console.log(`   GET    /api/users`);
    console.log(`   POST   /api/users`);
    console.log(`   GET    /api/users/:id`);
    console.log(`   PUT    /api/users/:id`);
    console.log(`   DELETE /api/users/:id`);
});