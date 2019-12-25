// Importing modules
import { startOfDay, isBefore, parseISO } from 'date-fns';
import * as Yup from 'yup';

// Importing models
import Register from '../models/Register';
import Plan from '../models/Plan';
import Student from '../models/Student';

// Importing Queue
import RegisterMail from '../jobs/RegisterMail';
import Queue from '../../lib/Queue';

class RegisterController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const register = await Register.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price'],
      order: ['start_date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          attributes: ['id', 'name', 'age', 'height', 'weight'],
        },
        {
          model: Plan,
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return res.json(register);
  }

  async show(req, res) {
    const register = await Register.findByPk(req.params.id, {
      attributes: ['id', 'start_date', 'end_date', 'price'],
    });
    if (!register) {
      return res.status(400).json({ error: 'The register does not found' });
    }

    return res.json(register);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .positive()
        .integer()
        .required(),
      plan_id: Yup.number()
        .positive()
        .integer()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id } = req.body;

    // Validating if the student is registered in the database
    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.status(400).json({ error: 'The student does not exists' });
    }

    // Validating if the plan is registered in the database
    const planExists = await Plan.findByPk(plan_id);

    if (!planExists) {
      return res.status(400).json({ error: 'The plan does not exists' });
    }

    // Validating if student_id register already exists
    const registerExists = await Register.findOne({
      where: { student_id: req.body.student_id },
    });

    if (registerExists) {
      return res.status(401).json({ error: 'The register already exists' });
    }

    const { start_date } = req.body;

    // Validating if the start_date is in future
    const startPast = startOfDay(parseISO(start_date)); // Timestamp
    const actualDate = startOfDay(new Date());

    if (isBefore(startPast, actualDate)) {
      return res.status(401).json({ error: 'The date is past' });
    }

    // Generete variables

    const register = await Register.create({
      ...req.body,
      start_date: startPast,
    });

    const student = await register.getStudent();
    const plan = await register.getPlan();

    // Sending email
    await Queue.add(RegisterMail.key, {
      register,
      plan,
      student,
    });

    return res.json(register);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number()
        .positive()
        .integer(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }
    const register = await Register.findByPk(req.params.id);

    if (!register) {
      return res.status(400).json({ error: 'Register not found' });
    }

    const { plan_id, start_date } = req.body;

    const planExists = await Plan.findByPk(plan_id);

    if (!planExists) {
      return res.status(400).json({ error: 'The plan does not exists' });
    }

    const startPast = startOfDay(parseISO(start_date));
    const actualDate = startOfDay(new Date());

    if (isBefore(startPast, actualDate)) {
      return res.status(401).json({ error: 'The date is past' });
    }

    const updatedRegister = await register.update({ start_date: startPast });

    return res.json(updatedRegister);
  }

  async delete(req, res) {
    const register = await Register.findByPk(req.params.id);

    if (!register) {
      return res.status(400).json({ error: 'Register not found' });
    }
    await register.destroy();
    return res.json('The register has been deleted');
  }
}
export default new RegisterController();
