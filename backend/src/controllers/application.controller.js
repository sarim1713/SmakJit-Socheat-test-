const applicationService = require('../services/application.service');
const opportunityService = require('../services/opportunity.service');

const getAll = async (req, res, next) => {
  try {
    const { status, opportunity, volunteer } = req.query;
    const applications = await applicationService.findAll({ status, opportunity, volunteer });
    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const application = await applicationService.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { opportunityId, message } = req.body;

    if (!opportunityId) {
      return res.status(400).json({ message: 'Opportunity ID is required' });
    }

    const opportunity = await opportunityService.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    if (opportunity.status === 'closed') {
      return res.status(400).json({ message: 'This opportunity is no longer accepting applications' });
    }

    const existing = await applicationService.findAll({
      opportunity: opportunityId,
      volunteer: req.user.id,
    });

    if (existing.length > 0) {
      return res.status(400).json({ message: 'You have already applied to this opportunity' });
    }

    const application = await applicationService.create({
      opportunity: opportunityId,
      opportunityTitle: opportunity.title,
      volunteer: req.user.id,
      volunteerName: req.user.name,
      message: message || '',
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be pending, accepted, or rejected' });
    }

    const application = await applicationService.update(req.params.id, { status });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const application = await applicationService.remove(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, updateStatus, remove };
