require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const jwtSecret = process.env.JWT_SECRET;

if (!supabaseKey || !jwtSecret) {
    console.error("Supabase Key or JWT Secret is missing. Please check your .env file.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Route to serve the signup page
app.get('/', (req, res) => {
    res.sendFile('signup.html', { root: __dirname + '/public' });
});

// Route to serve the home page
app.get('/home.html', (req, res) => {
    res.sendFile('home.html', { root: __dirname + '/public' });
});

// Route to add a new user with hashed password
app.post('/signup', async (req, res) => {
    console.log('Received add user request with body:', req.body);
    const { userName, fullName, userEmail, userPass } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(userPass, 10);

        const { data, error } = await supabase
            .from('users')
            .insert([{ username: userName, full_name: fullName, email: userEmail, password: hashedPassword }]);

        if (error) {
            console.error('Error adding user:', error.message);
            return res.status(500).json({ error: `Failed to add user: ${error.message}` });
        }

        console.log('User added successfully:', data);
        return res.status(200).json({ message: 'User added successfully' });
    } catch (error) {
        console.error('Unexpected error adding user:', error.message);
        return res.status(500).json({ error: `Failed to add user: ${error.message}` });
    }
});

/// Route to handle user login
app.post('/login', async (req, res) => {
    const { userEmail, userPass } = req.body;

    try {
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', userEmail)
            .single();

        if (userError || !userData) {
            console.error('Error fetching user:', userError.message);
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(userPass, userData.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: userData.id, userName: userData.username }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Unexpected error logging in:', error.message);
        return res.status(500).json({ error: `Failed to log in: ${error.message}` });
    }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        req.userId = decoded.userId;
        next();
    });
};

// Protected route example
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: `Hello user with ID: ${req.userId}` });
});

// Start the Express server
app.listen(port, () => {
    console.log(`App is live and listening on port ${port}`);
});