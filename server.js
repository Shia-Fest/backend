const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const connectDB = require('./config/db');
const candidateRoutes = require('./routes/candidateRoutes');

 connectDB();
const app = express();
const PORT = process.env.PORT

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('API is running...');
})

// API routes
app.use('/api/candidates', candidateRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
