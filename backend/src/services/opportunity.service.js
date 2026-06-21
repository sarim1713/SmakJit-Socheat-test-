const Opportunity = require('../models/opportunity.model');

const findAll = async (filters = {}) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.category) query.category = filters.category;
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { orgName: { $regex: filters.search, $options: 'i' } },
    ];
  }
  return await Opportunity.find(query).populate('organization', 'name email').sort({ createdAt: -1 });
};

const findById = async (id) => {
  return await Opportunity.findById(id).populate('organization', 'name email');
};

const create = async (data) => {
  const opportunity = new Opportunity(data);
  return await opportunity.save();
};

const update = async (id, data) => {
  return await Opportunity.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const remove = async (id) => {
  return await Opportunity.findByIdAndDelete(id);
};

module.exports = { findAll, findById, create, update, remove };
