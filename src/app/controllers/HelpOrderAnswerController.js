// Importing modules
import * as Yup from 'yup';

// Importing models
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
// Importing Queue
import Queue from '../../lib/Queue';
import HelpOrderMail from '../jobs/HelpOrderMail';

class HelpOrderAnswerController {
  // Listing unanswered questions
  async index(req, res) {
    const { page = 1 } = req.query;

    const unanswered = await HelpOrder.findAll({
      where: { answer: null },
      attributes: ['id', 'student_id', 'question', 'created_at'],
      order: ['created_at'],
      limit: 10,
      offset: (page - 1) * 10,
      include: {
        model: Student,
        as: 'student',
      },
    });

    return res.json(unanswered);
  }

  // Answering questions
  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const helpOrder = await HelpOrder.findByPk(req.params.id);
    if (!helpOrder) {
      return res.status(400).json({ error: 'The question does not exists' });
    }

    if (helpOrder.answer !== null) {
      return res
        .status(401)
        .json({ error: 'The question has already been answered' });
    }

    const { answer } = req.body;

    const updated = await helpOrder.update({ answer });

    await Queue.add(HelpOrderMail.key, {
      helpOrder: updated,
      student: await updated.getStudent(),
    });

    return res.json(updated);
  }
}

export default new HelpOrderAnswerController();
