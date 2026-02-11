const Category = require('../models/Category');

exports.createCategory = async (req, res, next) => {
    try {
        const cat = await Category.create(req.body);
        res.json(cat);
    } catch (e) { next(e); }
};

exports.getAllCategories = async (req, res, next) => {
    try {
        const cats = await Category.find().sort({ name: 1 });
        res.json(cats);
    } catch (e) { next(e); }
};

exports.getCategoryById = async (req, res, next) => {
    try {
        const cat = await Category.findById(req.params.id);
        if (!cat) return res.status(404).json({ message: 'Category not found' });
        res.json(cat);
    } catch (e) { next(e); }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const cat = await Category.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!cat) return res.status(404).json({ message: 'Category not found' });
        res.json(cat);
    } catch (e) { next(e); }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted' });
    } catch (e) { next(e); }
};
