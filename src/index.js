require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');


const authRoutes = require('./routes/authRoutes');
const topicRoutes = require('./routes/topicRoutes');
const progressRoutes = require('./routes/progressRoutes');


const app = express();
app.use(cors());
app.use(express.json());


// connect
connectDB();


app.get('/', (req, res) => res.send('API is running'));
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/progress', progressRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));