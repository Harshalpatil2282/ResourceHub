const University = require('../models/University');

exports.createUniversity = async (req, res) => {
  try {
    const { name } = req.body;
    const university = new University({ name });
    await university.save();
    res.status(201).json(university);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating university', error: err.message }); // Already present, check backend logs for more details
  }
};

exports.getUniversities = async (req, res) => {
  try {
    const data = await University.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching universities' });
  }
};
