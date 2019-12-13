// Importing modules
import { startOfDay, isBefore, parseISO } from 'date-fns';

// Importing models
import Register from '../models/Register';
import Plan from '../models/Plan';
import Student from '../models/Students';

class RegisterController {
  async store(req, res) {
    const { student_id, plan_id, start_date } = req.body;

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

    // Validating if the start_date is in future
    const startPast = startOfDay(parseISO(start_date)); // Timestamp
    const actualDate = startOfDay(new Date());
    if (isBefore(startPast, actualDate)) {
      return res.status(401).json({ error: 'The date is past' });
    }

    const register = await Register.create(req.body);
    return res.json(register);
  }

  async update(req, res) {
    const { id } = req.params;
    const registerExists = await Register.findByPk(id);

    if (!registerExists) {
      return res.status(400).json({ error: 'The register does not exists' });
    }

    const { plan_id, start_date } = req.body;

    // Validating if the plan is registered in the database
    const planExists = await Plan.findByPk(plan_id);
    if (!planExists) {
      return res.status(400).json({ error: 'The plan does not exists' });
    }

    const startPast = startOfDay(parseISO(start_date));
    const actualDate = startOfDay(new Date());
    if (isBefore(startPast, actualDate)) {
      return res.status(401).json({ error: 'The date is past' });
    }

    const updated = await Register.update(req.body);

    return res.json(updated);
  }
}

export default new RegisterController();
