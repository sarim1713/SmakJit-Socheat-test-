const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, applicationController.getAll);
router.get('/:id', authMiddleware, applicationController.getById);
router.post('/', authMiddleware, applicationController.create);
router.put('/:id/status', authMiddleware, applicationController.updateStatus);
router.delete('/:id', authMiddleware, applicationController.remove);

module.exports = router;
