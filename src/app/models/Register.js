// Register - gestão de matrícula
import { addMonths } from 'date-fns';
import Sequelize, { Model } from 'sequelize';

import Plan from './Plan';

class Register extends Model {
  static init(sequelize) {
    super.init(
      {
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

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id' });
    this.belongsTo(models.Plan, { foreignKey: 'plan_id' });
  }
}
export default Register;
