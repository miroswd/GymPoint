// Importing modules
import { startOfDay, isBefore, parseISO } from 'date-fns';
import * as Yup from 'yup';

// Importing models
import Register from '../models/Register';
import Plan from '../models/Plan';
import Student from '../models/Students';

import Mail from '../../lib/Mail';

class RegisterController {
  async index(req, res) {
    const register = await Register.findAll();
    return res.json(register);
  }

  async show(req, res) {
    const register = await Register.findOne({ where: { id: req.params.id } });
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

    const { student_id, plan_id, start_date } = req.body;

    // Validating if the student is registered in the database
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'The student does not exists' });
    }

    // Validating if the plan is registered in the database
    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'The plan does not exists' });
    }

    // Validating if student_id register already exists
    const registerExists = await Register.findOne({
      where: { student_id: req.body.student_id },
    });

    if (registerExists) {
      return res.status(401).json({ error: 'The register already exists' });
    }

    // Validating if the start_date is in future
    const startPast = startOfDay(parseISO(start_date)); // Timestamp
    const actualDate = startOfDay(new Date());
    if (isBefore(startPast, actualDate)) {
      return res.status(401).json({ error: 'The date is past' });
    }

    const { id, end_date, price } = await Register.create(req.body);
    const { name, email } = student;
    const { title } = plan;
    // Sending email

    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Bem-vindo(a) ao GymPoint',
      text: 'Você está matriculado(a)',
    });

    return res.json({
      id,
      plan_id,
      title,
      name,
      email,
      start_date,
      end_date,
      price,
    });
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

    const updatedRegister = await register.update(req.body);
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
