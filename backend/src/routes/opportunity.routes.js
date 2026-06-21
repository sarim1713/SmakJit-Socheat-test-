const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunity.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', opportunityController.getAll);
router.get('/:id', opportunityController.getById);
router.post('/', authMiddleware, opportunityController.create);
router.put('/:id', authMiddleware, opportunityController.update);
router.delete('/:id', authMiddleware, opportunityController.remove);

module.exports = router;
