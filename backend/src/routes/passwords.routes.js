const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove, generate, stats } = require('../controllers/passwords.controller');
const { authenticate } = require('../middleware/auth');
const { createLimiter } = require('../middleware/rateLimiter');

// Toutes les routes nécessitent d'être authentifié
router.use(authenticate);

router.get('/', getAll);
router.get('/stats', stats);
router.post('/generate', generate);
router.get('/:id', getOne);
router.post('/', createLimiter, create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
