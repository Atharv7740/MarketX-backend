const Service = require('../models/Service');

const createService = async (req, res) => {
  try {
    const { shopId, name, description, timeTaken, price, image } = req.body;

    const newService = new Service({
      shopId,
      name,
      description,
      timeTaken,
      price,
      image,
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await Service.find({ shopId: req.user.shopId });
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const { name, description, timeTaken, price, image } = req.body;

    // Delete old service image if a new image is uploaded
    if (image && service.image !== image) {
      service.image = null;
    }

    service.name = name;
    service.description = description;
    service.timeTaken = timeTaken;
    service.price = price;
    if (image) service.image = image;

    await service.save();

    res.status(200).json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.remove();
    res.status(200).json({ message: 'Service removed' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { createService, getServices, getServiceById, updateService, deleteService };
