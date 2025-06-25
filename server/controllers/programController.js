const Program = require('../models/Program');

exports.createProgram = async (req, res) => {
  try {
    const { name, universityId } = req.body;
    const program = new Program({ name, universityId });
    await program.save();
    res.status(201).json(program);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating program', error: err.message });
  }
};

exports.getProgramsByUniversity = async (req, res) => {
  try {
    const { universityId } = req.params;
    const programs = await Program.find({ universityId });
    res.json(programs);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching programs' });
  }
};
