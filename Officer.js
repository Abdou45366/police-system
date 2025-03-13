const mongoose = require('mongoose');

// Fined Driver Schema
const FinedDriverSchema = new mongoose.Schema({
  licenseNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentDeadline: { type: Date, required: true },
  paid: { type: Boolean, default: false },
  fineDate: { type: Date, required: true},
  reason: { type: String, required: true}
});

// Police Officer Schema
const OfficerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountActivated: { type: Boolean, default: false },
  finedDrivers: [FinedDriverSchema] // List of fined drivers
});

module.exports = mongoose.model('Officer', OfficerSchema);

