// Register - gestão de matrícula

import Sequelize, { Model } from 'sequelize';
import { addMonths } from 'date-fns';

import Plan from './Plan';

class Register extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        plan_id: Sequelize.INTEGER,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.DECIMAL(10, 2),
      },
      { sequelize }
    );

    this.addHook('beforeSave', async register => {
      if (register.plan_id) {
        const { duration, price } = await Plan.findByPk(register.plan_id);
        register.end_date = addMonths(register.start_date, duration);
        register.price = duration * price;
      }
    });
    return this;
  }
}
export default Register;
