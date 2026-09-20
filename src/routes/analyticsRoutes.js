const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');

router.get('/', async (req, res) => {
  const { days = 30 } = req.query;
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));
  
  const analytics = await Analytics.find({
    date: { $gte: startDate }
  }).sort({ date: 1 });

  const summary = {
    period: `Last ${days} days`,
    startDate,
    endDate: new Date(),
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    completionRate: 0,
    data: analytics
  };

  if (analytics.length > 0) {
    summary.totalBookings = analytics.reduce((sum, a) => sum + a.totalBookings, 0);
    summary.totalRevenue = analytics.reduce((sum, a) => sum + a.totalRevenue, 0);
    summary.averageRating = (
      analytics.reduce((sum, a) => sum + a.averageRating, 0) / analytics.length
    ).toFixed(2);
    summary.completionRate = (
      (analytics.reduce((sum, a) => sum + a.completedBookings, 0) / summary.totalBookings) * 100
    ).toFixed(2);
  }

  res.json(summary);
});

router.get('/date/:date', async (req, res) => {
  const date = new Date(req.params.date);
  date.setHours(0, 0, 0, 0);

  const analytics = await Analytics.findOne({ date });
  if (!analytics) {
    return res.status(404).json({ error: 'Analytics data not found for this date' });
  }

  res.json(analytics);
});

module.exports = router;
