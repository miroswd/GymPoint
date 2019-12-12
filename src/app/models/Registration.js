// Registration - gestão de matrícula

import Sequelize, { Model } from 'sequelize';

class Registration extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        plan_id: Sequelize.INTEGER,
        start_date: Sequelize.DATE,
      },
      { sequelize }
    );
  }
}

export default Registration;
