const User = require('../models/user.model');

const findAll = async (filters = {}) => {
  const query = {};
  if (filters.role) query.role = filters.role;
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { email: { $regex: filters.search, $options: 'i' } },
    ];
  }
  return await User.find(query).select('-password').sort({ createdAt: -1 });
};

const findById = async (id) => {
  return await User.findById(id).select('-password');
};

const create = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const update = async (id, userData) => {
  return await User.findByIdAndUpdate(id, userData, { new: true, runValidators: true });
};

const remove = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = { findAll, findById, create, update, remove };
