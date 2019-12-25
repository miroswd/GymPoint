// HelpOrder - CRUD
// Importing modules
import * as Yup from 'yup';

// Importing models
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  // Listing all student questions
  async index(req, res) {
    const { page = 1 } = req.query;
    const student = req.params.id;
    const questions = await HelpOrder.findAll({
      where: { student_id: student },
      attributes: ['question', 'created_at', 'answer', 'answer_at'],
      order: ['answer_at'],
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(questions);
  }

  // Create question in database
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const student_id = req.params.id;
    const student = await Student.findByPk(student_id);

    // Validating if the student exists
    if (!student) {
      return res.status(401).json({ error: 'The student does not exists' });
    }

    const { question } = req.body;

    const helpOrder = await HelpOrder.create({ student_id, question });

    return res.json(helpOrder);
  }
}
export default new HelpOrderController();
