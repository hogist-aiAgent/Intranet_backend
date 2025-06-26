const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  staffName: String,
  gender: { type: String, enum: ['M', 'F'] },
  dob: Date,
  bloodGroup: String,
  contactNumber: String,
  alternateContactNumber: String,

  panNumber: String,
  aadharNumber: String,
  currentAddress: String,
  permanentAddress: String,
  relationName: String,
  relationType: String,

  doj: Date,
  dor: Date,
  totalYearsCompleted: Number,
  role: String,
  department: String,
  jobType: { type: String, enum: ['Onsite', 'Offsite', 'Both'] },

  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    pfAccountNumber: String,
    esicNumber: String,
  },

  assets: {
    laptop: Boolean,
    laptopCharger: Boolean,
    mouse: Boolean,
    accessCard: Boolean,
    tShirt: Boolean,
    simCard: Boolean,
  },

  documents: {
    offerLetter: Boolean,
    experienceLetter: Boolean,
    relievingLetter: Boolean,
    resume: Boolean,
    aadhar: Boolean,
    pan: Boolean,
    rnr: Boolean,
  }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
