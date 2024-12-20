const express = require('express');
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');

router.get('/', authenticate, getEvents);
router.get('/:id', authenticate, getEventById);
router.post('/', authenticate, createEvent);
router.post('/:id', authenticate, updateEvent);
router.delete('/:id', authenticate, deleteEvent);

module.exports = router;