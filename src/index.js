// require('dotenv').config();
// const express = require('express');
// const connectDB = require('./config/db');
// const cors = require('cors');


// const authRoutes = require('./routes/authRoutes');
// const topicRoutes = require('./routes/topicRoutes');
// const progressRoutes = require('./routes/progressRoutes');


// const app = express();
// app.use(cors());
// app.use(express.json());


// // connect
// connectDB();


// app.get('/', (req, res) => res.send('API is running'));
// app.use('/api/auth', authRoutes);
// app.use('/api/topics', topicRoutes);
// app.use('/api/progress', progressRoutes);


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const topicRoutes = require('./routes/topicRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();

// ✅ CORS configuration (allow frontend on Vercel)
app.use(cors({
  origin: ['https://apna-app1.vercel.app'], // your Vercel frontend
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

app.use(express.json());

// ✅ Connect MongoDB
connectDB();

// ✅ Routes
app.get('/', (req, res) => res.send('API is running ✅'));
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/progress', progressRoutes);

// ✅ Global error handler (logs errors for debugging)
app.use((err, req, res, next) => {
  console.error("Server Error ❌:", err.message);
  res.status(500).json({ message: "Server Error", error: err.message });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
