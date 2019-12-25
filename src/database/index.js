// Conexão dos models com o database
import Sequelize from 'sequelize';

// Importando as credenciais
import databaseConfig from '../config/database';

// Importando os models
import Admin from '../app/models/Admin';
import Checkin from '../app/models/Checkin';
import HelpOrder from '../app/models/HelpOrder';
import Plan from '../app/models/Plan';
import Register from '../app/models/Register';
import Student from '../app/models/Student';

const models = [Admin, Checkin, HelpOrder, Plan, Register, Student];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Método que irá fazer a conexão com o database
    this.connection = new Sequelize(databaseConfig); // já tenho a conexão

    // Percorrendo o array, retornando cada model
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
    // Só vai executar se existir
  }
}

export default new Database();
