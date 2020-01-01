// Criação do usuário no banco de dados
import * as Yup from 'yup';
// Importando o Model
import Student from '../models/Student';

class StudentController {
  // Listing all students
  async index(req, res) {
    const { page = 1 } = req.query;
    const students = await Student.findAll({
      order: ['created_at'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'name', 'email', 'height', 'weight'],
    });
    return res.json(students);
  }

  // Listing only one student
  async show(req, res) {
    const student = await Student.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'height', 'weight'],
    });

    if (!student) {
      return res.status(400).json({ error: 'The student does not exists' });
    }
    return res.json(student);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
      age: Yup.number()
        .integer()
        .positive()
        .required(),
      height: Yup.number()
        .positive()
        .required(),
      weight: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    // Validando se o email já existe no banco de dados
    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, age, height, weight } = await Student.create(
      req.body
    );
    return res.json({ id, name, email, age, height, weight });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number()
        .integer()
        .positive(),
      height: Yup.number().positive(),
      weight: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation is fail' });
    }

    const { email } = req.body;
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'The students does not exists' });
    }

    if (email && email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });
      if (studentExists) {
        return res.status(401).json({ error: 'Student already exists' });
      }
    }
    const { name, age, height, weight } = await student.update(req.body);
    return res.json({ name, email, age, height, weight });
  }

  async delete(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'The student does not exits' });
    }
    student.destroy();
    return res.json('The student has been deleted');
  }
}

export default new StudentController();
