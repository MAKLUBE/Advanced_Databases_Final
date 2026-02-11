const Supplier = require('../models/Supplier');

exports.createSupplier = async (req, res, next) => {
    try {
        const sup = await Supplier.create(req.body);
        res.json(sup);
    } catch (e) { next(e); }
};

exports.getAllSuppliers = async (req, res, next) => {
    try {
        const sups = await Supplier.find().sort({ name: 1 });
        res.json(sups);
    } catch (e) { next(e); }
};

exports.getSupplierById = async (req, res, next) => {
    try {
        const sup = await Supplier.findById(req.params.id);
        if (!sup) return res.status(404).json({ message: 'Supplier not found' });
        res.json(sup);
    } catch (e) { next(e); }
};

exports.updateSupplier = async (req, res, next) => {
    try {
        const sup = await Supplier.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!sup) return res.status(404).json({ message: 'Supplier not found' });
        res.json(sup);
    } catch (e) { next(e); }
};

exports.deleteSupplier = async (req, res, next) => {
    try {
        await Supplier.findByIdAndDelete(req.params.id);
        res.json({ message: 'Supplier deleted' });
    } catch (e) { next(e); }
};
