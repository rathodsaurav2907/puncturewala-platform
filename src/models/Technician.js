const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
  technicianId: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 1,
    max: 5
  },
  serviceArea: [String],
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-break'],
    default: 'active'
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  completedBookings: {
    type: Number,
    default: 0
  },
  averageResponseTime: {
    type: Number,
    default: 15
  },
  certifications: [String],
  hourlyRate: {
    type: Number,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

technicianSchema.index({ rating: -1 });
technicianSchema.index({ status: 1 });
technicianSchema.index({ serviceArea: 1 });

module.exports = mongoose.model('Technician', technicianSchema);
