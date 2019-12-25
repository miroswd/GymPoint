// Listagem, cadastro, atualização, remoção de planos

import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  // List
  async index(req, res) {
    const plans = await Plan.findAll();
    return res.json(plans);
  }

  async show(req, res) {
    const plan = await Plan.findOne({ where: req.params });

    if (!plan) {
      return res
        .status(400)
        .json({ error: 'Plan not found, check the id of plan' });
    }

    return res.json(plan);
  }

  // Create
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation is Fail' });
    }

    const planExists = await Plan.findOne({ where: { title: req.body.title } });

    if (planExists) {
      return res.status(401).json({ error: 'The plan already exists' });
    }

    const { title, duration, price } = await Plan.create(req.body);
    return res.json({ title, duration, price });
  }

  // Update
  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().positive(),
      price: Yup.number().positive(),
    });

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json('The plan not was found');
    }

    const planExists = await Plan.findOne({ where: { title: req.body.title } });

    if (planExists) {
      return res.status(401).json({ error: 'The plan already exists' });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json('Validation fails');
    }

    const updatedPlan = await plan.update(req.body);

    return res.json(updatedPlan);
  }

  // Delete
  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      return res.status(400).json('Then plan was not found');
    }

    plan.destroy();
    return res.status(200).json('The plan has been deleted');
  }
}

export default new PlanController();
