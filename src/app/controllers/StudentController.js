// Criação do usuário no banco de dados
import * as Yup from 'yup';
// Importando o Model
import Student from '../models/Students';

class StudentController {
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

    if (email && email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });
      if (studentExists) {
        return res.status(401).json({ error: 'Student already exists' });
      }
    }
    const { name, age, height, weight } = await student.update(req.body);
    return res.json({ name, email, age, height, weight });
  }
}

export default new StudentController();
