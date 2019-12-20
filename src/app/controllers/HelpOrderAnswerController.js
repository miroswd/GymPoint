// Importing modules
import * as Yup from 'yup';

// Importing models
import HelpOrder from '../models/HelpOrder';

class HelpOrderAnswerController {
  // Listing unanswered questions
  async index(req, res) {
    const { page = 1 } = req.query;
    const unanswered = await HelpOrder.findAll({
      where: { answer: null },
      attributes: ['id', 'student_id', 'question', 'created_at'],
      order: ['created_at'],
      limit: 10,
      offset: (page - 1) * 20,
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

    const question = await HelpOrder.findByPk(req.params.id);
    if (!question) {
      return res.status(400).json({ error: 'The question does not exists' });
    }

    if (question.answer !== null) {
      return res
        .status(401)
        .json({ error: 'The question has already been answered' });
    }

    const { answer } = req.body;
    const answer_at = question.answerAt;
    const updated_at = question.updatedAt;

    await question.update(answer);

    return res.json({ answer_at, updated_at });
  }
}

export default new HelpOrderAnswerController();
