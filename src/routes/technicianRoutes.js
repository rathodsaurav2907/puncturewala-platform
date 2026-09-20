const express = require('express');
const router = express.Router();
const Technician = require('../models/Technician');
const { validateTechnician } = require('../middleware/validation');

router.post('/', async (req, res) => {
  const { error, value } = validateTechnician(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const technicianId = `TECH-${Date.now()}`;
  const technician = new Technician({
    ...value,
    technicianId
  });

  await technician.save();
  res.status(201).json(technician);
});

router.get('/', async (req, res) => {
  const { status, minRating, limit = 20, offset = 0 } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  if (minRating) filter.rating = { $gte: parseFloat(minRating) };

  const technicians = await Technician.find(filter)
    .limit(parseInt(limit))
    .skip(parseInt(offset))
    .sort({ rating: -1 });

  const total = await Technician.countDocuments(filter);

  res.json({
    technicians,
    pagination: {
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    }
  });
});

router.get('/:id', async (req, res) => {
  const technician = await Technician.findById(req.params.id);
  if (!technician) {
    return res.status(404).json({ error: 'Technician not found' });
  }
  res.json(technician);
});

router.put('/:id', async (req, res) => {
  const technician = await Technician.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!technician) {
    return res.status(404).json({ error: 'Technician not found' });
  }

  res.json(technician);
});

router.delete('/:id', async (req, res) => {
  const technician = await Technician.findByIdAndDelete(req.params.id);
  if (!technician) {
    return res.status(404).json({ error: 'Technician not found' });
  }
  res.json({ message: 'Technician deleted successfully' });
});

module.exports = router;
