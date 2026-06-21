const Application = require('../models/application.model');

const findAll = async (filters = {}) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.opportunity) query.opportunity = filters.opportunity;
  if (filters.volunteer) query.volunteer = filters.volunteer;
  return await Application.find(query)
    .populate('opportunity', 'title')
    .populate('volunteer', 'name email')
    .sort({ createdAt: -1 });
};

const findById = async (id) => {
  return await Application.findById(id)
    .populate('opportunity', 'title')
    .populate('volunteer', 'name email');
};

const create = async (data) => {
  const application = new Application(data);
  return await application.save();
};

const update = async (id, data) => {
  return await Application.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const remove = async (id) => {
  return await Application.findByIdAndDelete(id);
};

module.exports = { findAll, findById, create, update, remove };
