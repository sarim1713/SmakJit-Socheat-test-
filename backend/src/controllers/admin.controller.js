const User = require('../models/user.model');
const Opportunity = require('../models/opportunity.model');
const Application = require('../models/application.model');
const userService = require('../services/user.service');
const opportunityService = require('../services/opportunity.service');
const applicationService = require('../services/application.service');

const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalOrgs, totalOpportunities, totalApplications, usersByRole, oppsByStatus, appsByStatus] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'organization' }),
      Opportunity.countDocuments(),
      Application.countDocuments(),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      Opportunity.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    res.status(200).json({
      totalUsers,
      totalOrgs,
      totalOpportunities,
      totalApplications,
      usersByRole: usersByRole.reduce((acc, r) => ({ ...acc, [r._id]: r.count }), {}),
      oppsByStatus: oppsByStatus.reduce((acc, r) => ({ ...acc, [r._id]: r.count }), {}),
      appsByStatus: appsByStatus.reduce((acc, r) => ({ ...acc, [r._id]: r.count }), {}),
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const users = await userService.findAll({ role, search });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'email', 'role'];
    const data = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    }

    if (data.role && !['user', 'admin', 'organization'].includes(data.role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await userService.update(req.params.id, data);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await userService.remove(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getOpportunities = async (req, res, next) => {
  try {
    const { status, category, search } = req.query;
    const opportunities = await opportunityService.findAll({ status, category, search });
    res.status(200).json(opportunities);
  } catch (error) {
    next(error);
  }
};

const getApplications = async (req, res, next) => {
  try {
    const { status, opportunity, volunteer } = req.query;
    const applications = await applicationService.findAll({ status, opportunity, volunteer });
    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getOpportunities,
  getApplications,
};
