const opportunityService = require('../services/opportunity.service');

const getAll = async (req, res, next) => {
  try {
    const { status, category, search } = req.query;
    const opportunities = await opportunityService.findAll({ status, category, search });
    res.status(200).json(opportunities);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const opportunity = await opportunityService.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.status(200).json(opportunity);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { title, description, category, location, date, spots, requirements, commitment } = req.body;

    if (!title || !description || !category || !location || !date || !spots) {
      return res.status(400).json({ message: 'Title, description, category, location, date, and spots are required' });
    }

    const opportunity = await opportunityService.create({
      title,
      orgName: req.user.name,
      organization: req.user.id,
      description,
      category,
      location,
      date,
      spots,
      requirements,
      commitment,
    });

    res.status(201).json(opportunity);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const opportunity = await opportunityService.update(req.params.id, req.body);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.status(200).json(opportunity);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const opportunity = await opportunityService.remove(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.status(200).json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
