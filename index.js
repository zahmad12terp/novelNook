require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcryptjs');
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

// Route to handle user login
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

        const token = jwt.sign({ username: userData.username }, jwtSecret, { expiresIn: '1h' });
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

        req.username = decoded.username;
        next();
    });
};

// Route to store book data
app.post('/store-book', verifyToken, async (req, res) => {
    const { olid, isbn, book_title, book_genre, book_description, book_author } = req.body;
    const username = req.username; // Extracted from the token

    console.log('Received payload:', req.body);

    try {
        const { data, error } = await supabase
            .from('myBookCollection')
            .insert([{ username, isbn, book_title, book_author, book_genre, book_description }]);

        if (error) {
            if (error.code === '23505') { // Unique violation error code
                return res.status(409).json({ error: 'You have already liked this book.' });
            }
            throw error;
        }

        res.status(200).json({ message: 'Book stored successfully' });
    } catch (error) {
        console.error('Error storing book:', error.message);
        res.status(500).json({ error: 'Failed to store book' });
    }
});

// Route to fetch liked books for the logged-in user
app.get('/mybooks', verifyToken, async (req, res) => {
    const username = req.username; // Extracted from the token

    try {
        const { data, error } = await supabase
            .from('myBookCollection')
            .select('*')
            .eq('username', username);

        if (error) {
            throw error;
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching book collection:', error.message);
        res.status(500).json({ error: 'Failed to fetch book collection' });
    }
});

app.delete('/delete-book', verifyToken, async (req, res) => {
    const { username, isbn } = req.body;

    try {
        const { data, error } = await supabase
            .from('myBookCollection')
            .delete()
            .match({ username, isbn });

        if (error) {
            throw error;
        }

        res.status(200).json({ message: 'Book deleted successfully.' });
    } catch (error) {
        console.error('Error deleting book:', error.message);
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

// Protected route example
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: `Hello user with username: ${req.username}` });
});

// Ensure My Books page is accessible only to logged-in users
app.get('/mybooks.html', verifyToken, (req, res) => {
    res.sendFile('mybooks.html', { root: __dirname + '/public' });
});

// Start the Express server
app.listen(port, () => {
    console.log(`App is live and listening on port ${port}`);
});
