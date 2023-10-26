const express = require('express');
const router = express.Router();
const Holiday = require('../models/Holiday');
const { ensureAuthenticated } = require('../config/auth');

// Get all holidays
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const holidays = await Holiday.find({ user: req.user.id });
    res.json(holidays);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one holiday
router.get('/:id', ensureAuthenticated, getHoliday, (req, res) => {
  res.json(res.holiday);
});

// Create a holiday
router.post('/', ensureAuthenticated, async (req, res) => {
  const holiday = new Holiday({
    user: req.user.id,
    country: req.body.country,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  });
  try {
    const newHoliday = await holiday.save();
    res.status(201).json(newHoliday);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a holiday
router.patch('/:id', ensureAuthenticated, getHoliday, async (req, res) => {
  if (req.body.country != null) {
    res.holiday.country = req.body.country;
  }
  if (req.body.startDate != null) {
    res.holiday.startDate = req.body.startDate;
  }
  if (req.body.endDate != null) {
    res.holiday.endDate = req.body.endDate;
  }
  try {
    const updatedHoliday = await res.holiday.save();
    res.json(updatedHoliday);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a holiday
router.delete('/:id', ensureAuthenticated, getHoliday, async (req, res) => {
  try {
    await res.holiday.remove();
    res.json({ message: 'Deleted Holiday' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getHoliday(req, res, next) {
  let holiday;
  try {
    holiday = await Holiday.findById(req.params.id);
    if (holiday == null) {
      return res.status(404).json({ message: 'Cannot find holiday' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  
  res.holiday = holiday;
  next();
}

module.exports = router;