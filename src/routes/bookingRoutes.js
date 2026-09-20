const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Technician = require('../models/Technician');
const { validateBooking } = require('../middleware/validation');

router.post('/', async (req, res) => {
  const { error, value } = validateBooking(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const technician = await Technician.findById(value.technicianId);
  if (!technician) {
    return res.status(404).json({ error: 'Technician not found' });
  }

  const bookingId = `BK-${Date.now()}`;
  const booking = new Booking({
    ...value,
    technicianName: technician.name,
    bookingId
  });

  await booking.save();
  res.status(201).json(booking);
});

router.get('/', async (req, res) => {
  const { status, technicianId, limit = 20, offset = 0 } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  if (technicianId) filter.technicianId = technicianId;

  const bookings = await Booking.find(filter)
    .limit(parseInt(limit))
    .skip(parseInt(offset))
    .sort({ createdAt: -1 });

  const total = await Booking.countDocuments(filter);

  res.json({
    bookings,
    pagination: {
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    }
  });
});

router.get('/:id', async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json(booking);
});

router.patch('/:id', async (req, res) => {
  const allowedFields = ['status', 'completionTime', 'paymentStatus', 'rating', 'notes'];
  const updates = {};
  
  allowedFields.forEach(field => {
    if (field in req.body) {
      updates[field] = req.body[field];
    }
  });

  updates.updatedAt = new Date();

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  res.json(booking);
});

router.delete('/:id', async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json({ message: 'Booking deleted successfully' });
});

module.exports = router;
