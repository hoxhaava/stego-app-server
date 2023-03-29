const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authMiddleware = require('./middlewares/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes')

const app = express();

// Enable CORS middleware
app.use(cors());

// Enable body-parser middleware
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/users', userRoutes)
app.get('/:id', userRoutes)

// Define route handlers
app.post('/signup', authRoutes);
app.post('/signin', authRoutes);
// app.get('/protected', authMiddleware, (req, res) => {
//     res.send(`Protected route accessed by user: ${req.user.email}`);
// });
app.post('/logout/:id', authRoutes)

// Start server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});