//
import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Admin extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.STRING,
      },
      { sequelize }
    );
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

export default Admin;
