// Listagem, cadastro, atualização, remoção de planos

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
    const { title, duration, price } = await Plan.create(req.body);
    return res.json({ title, duration, price });
  }

  // Update
  async update(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    const updatedPlan = await plan.update(req.body);

    return res.json(updatedPlan);
  }

  // Delete
  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);
    plan.destroy();
    return res.status(200).json('The plan has been deleted');
  }
}

export default new PlanController();
