const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const server = express();
server.use(cors());
server.use(express.json());
const mongoURI = process.env.mongo_uri;
if (!mongoURI) {
  console.error('MongoDB URI is not defined in the .env file.');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));


const applicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  dob: String,
  phone: String,
  address: String,
  gender: String,
  scholarship: String,
});

const Application = mongoose.model('Application', applicationSchema);


server.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error });
  }
});


server.post('/apply', async (req, res) => {
  try {
    const newApplication = new Application(req.body);
    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(400).json({ message: 'Error saving application', error });
  }
});


const port = 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
