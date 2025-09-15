const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const connectDB = require('./config/db');
const candidateRoutes = require('./routes/candidateRoutes');
const teamRoutes = require('./routes/teamRoutes');
const programmeRoutes = require('./routes/programmeRoutes');

connectDB();
const app = express();
const PORT = process.env.PORT

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/programmes', programmeRoutes);


app.get('/', (req, res) => {
    res.send('API is running...');
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
