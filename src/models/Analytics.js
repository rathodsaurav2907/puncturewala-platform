const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  completedBookings: {
    type: Number,
    default: 0
  },
  cancelledBookings: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  activeBookings: {
    type: Number,
    default: 0
  },
  averageCompletionTime: {
    type: Number,
    default: 0
  },
  totalTechnicians: {
    type: Number,
    default: 0
  },
  activeTechnicians: {
    type: Number,
    default: 0
  },
  newBookings: {
    type: Number,
    default: 0
  },
  peakHour: {
    type: Number,
    default: 0
  },
  serviceTypeDistribution: {
    punctureRepair: Number,
    tireReplacement: Number,
    wheelAlignment: Number,
    emergency: Number
  },
  topTechnicians: [
    {
      technicianId: String,
      name: String,
      bookingsCompleted: Number,
      revenue: Number
    }
  ],
  paymentMetrics: {
    totalPayments: Number,
    successfulPayments: Number,
    failedPayments: Number,
    paymentSuccessRate: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

analyticsSchema.index({ date: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
