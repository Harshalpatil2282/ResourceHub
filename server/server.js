// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

const _dirname = path.resolve();

// Import routes
const authRoutes = require('./routes/authRoutes');
const universityRoutes = require('./routes/universityRoutes');
const programRoutes = require('./routes/programRoutes');
const folderRoutes = require('./routes/folderRoutes');
const fileRoutes = require('./routes/fileRoutes');
const activityRoutes = require('./routes/activityRoutes');


// More routes will be added later...

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/activities' , activityRoutes);

app.use(express.static(path.join(_dirname, "..","client/build")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "..","client","build", "index.html"));
})


// DB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch(err => console.log(err));
