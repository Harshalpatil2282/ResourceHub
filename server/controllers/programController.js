const Program = require('../models/Program');

exports.createProgram = async (req, res) => {
  try {
    const { name, universityId } = req.body;

    if (!name || !universityId) {
      return res.status(400).json({ msg: 'Name and universityId are required' });
    }

    const program = new Program({ name, university: universityId });
    await program.save();

    res.status(201).json(program);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error creating program', error: err.message });
  }
};

exports.getProgramsByUniversity = async (req, res) => {
  try {
    const { universityId } = req.params;
    const programs = await Program.find({ university: universityId });
    res.json(programs);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching programs', error: err.message });
  }
};
