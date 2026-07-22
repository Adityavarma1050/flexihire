import Category from '../models/Category.js';

// @desc    Get job categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const rawCategories = await Category.find().sort({ name: 1 });

    const categories = rawCategories.map((c) => ({
      ...c.toObject(),
      id: c._id.toString(),
    }));

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category (Admin only)
// @route   POST /api/categories
// @access  Private (Admin)
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if category name or slug already exists
    const existingCategory = await Category.findOne({ $or: [{ name: name.trim() }, { slug }] });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: 'Category name already exists.' });
    }

    const category = await Category.create({
      name: name.trim(),
      slug,
      description: description || '',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category: {
        ...category.toObject(),
        id: category._id.toString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category (Admin only)
// @route   PUT /api/categories/:id
// @access  Private (Admin)
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    if (name && name.trim() !== category.name) {
      const newName = name.trim();
      const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Check if duplicate slug exists elsewhere
      const duplicate = await Category.findOne({ _id: { $ne: id }, slug });
      if (duplicate) {
        return res.status(400).json({ success: false, message: 'Category name already exists.' });
      }

      category.name = newName;
      category.slug = slug;
    }

    if (description !== undefined) {
      category.description = description;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      category: {
        ...category.toObject(),
        id: category._id.toString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category (Admin only)
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
