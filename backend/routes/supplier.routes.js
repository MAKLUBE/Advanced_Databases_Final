const router = require('express').Router();
const controller = require('../controllers/supplier.controller');
const { requireRole } = require('../middleware/auth');

router.post('/', requireRole('admin'), controller.createSupplier);
router.get('/', controller.getAllSuppliers);
router.get('/:id', controller.getSupplierById);
router.put('/:id', requireRole('admin'), controller.updateSupplier);
router.delete('/:id', requireRole('admin'), controller.deleteSupplier);

module.exports = router;