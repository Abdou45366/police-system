const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Officer = require('./models/Officer');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/policeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Register a Police Officer (Check if Exists)
app.post('/register', async (req, res) => {
  const { name, idNumber, email, password } = req.body;

  const existingOfficer = await Officer.findOne({ idNumber });
  if (existingOfficer) return res.status(400).json({ message: "Officer already exists" });

  const newOfficer = new Officer({ name, idNumber, email, password, accountActivated: true });
  await newOfficer.save();
  
  res.status(201).json({ message: "Account created successfully", officer: newOfficer });
});

// Fine a Driver (Add to Officer's List)
app.post('/fine', async (req, res) => {
  const { idNumber, licenseNumber, amount, paymentDeadline } = req.body;

  const officer = await Officer.findOne({ idNumber });
  if (!officer) return res.status(404).json({ message: "Officer not found" });

  const finedDriver = { licenseNumber, amount, paymentDeadline };
  officer.finedDrivers.push(finedDriver);
  await officer.save();

  res.status(200).json({ message: "Driver fined successfully", finedDrivers: officer.finedDrivers });
});

// Get Officer Data (Including Fined Drivers)
app.get('/officer/:idNumber', async (req, res) => {
  const officer = await Officer.findOne({ idNumber });
  if (!officer) return res.status(404).json({ message: "Officer not found" });

  res.json(officer);
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
