const express = require('express'); 
const cors = require('cors'); 
const fs = require('fs').promises; 
const path = require('path'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

const app = express(); 
app.use(cors()); 
app.use(express.json()); 

const dbPath = path.join(__dirname, 'data', 'db.json'); 
const JWT_SECRET = 'your_super_secret_key'; // Use an environment variable in production 

// --- Helper Functions --- 
const readData = async () => { 
    try { 
        const data = await fs.readFile(dbPath, 'utf8'); 
        return JSON.parse(data); 
    } catch (error) { 
        // If the file doesn't exist or is empty, return a default structure 
        return { users: [], chats: [] }; 
    } 
}; 

const writeData = async (data) => { 
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2)); 
}; 

// --- API Routes --- 

// User registration 
app.post('/register', async (req, res) => { 
    const { username, password } = req.body; 
    const data = await readData(); 
    const userExists = data.users.find(u => u.username === username); 

    if (userExists) { 
        return res.status(400).json({ message: 'User already exists.' }); 
    } 

    const hashedPassword = await bcrypt.hash(password, 10); 
    data.users.push({ username, password: hashedPassword }); 
    await writeData(data); 

    res.status(201).json({ message: 'User registered successfully.' }); 
}); 

// User login 
app.post('/login', async (req, res) => { 
    const { username, password } = req.body; 
    const data = await readData(); 
    const user = data.users.find(u => u.username === username); 

    if (!user || !await bcrypt.compare(password, user.password)) { 
        return res.status(401).json({ message: 'Invalid credentials.' }); 
    } 

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' }); 
    res.json({ token }); 
}); 

// Fetch chat history 
app.post('/chat', async (req, res) => { 
    const { from, to, password } = req.body; 
    const data = await readData(); 
    const user = data.users.find(u => u.username === from); 

    if (!user || !await bcrypt.compare(password, user.password)) { 
        return res.status(401).json({ message: 'Incorrect password.' }); 
    } 

    const chat = data.chats.filter(c => 
        (c.from === from && c.to === to) || (c.from === to && c.to === from) 
    ); 

    res.json(chat); 
}); 

// Send a new message 
app.post('/send', async (req, res) => { 
    const { from, to, text } = req.body; 
    const data = await readData(); 
    const newMessage = { from, to, text, timestamp: new Date().toISOString() }; 
    data.chats.push(newMessage); 
    await writeData(data); 

    res.status(201).json(newMessage); 
}); 

module.exports = app;
