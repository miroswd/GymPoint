// Criando o aluno no banco de dados
import Sequelize, { Model } from 'sequelize';

class Students extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        age: Sequelize.INTEGER,
        height: Sequelize.FLOAT,
        weight: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );
  }
}

export default Students;
