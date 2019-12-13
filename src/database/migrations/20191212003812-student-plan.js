// Devo referenciar o aluno ao plano - gestão de matrícula

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('registers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      student_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'students',
          key: 'id',
        },
        allowNull: false,
      },
      plan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'plans',
          key: 'id',
        },
        allowNull: false,
      },
      start_date: {
        // Início da matrícula - escolhida pelo o usuário
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        // Calculado automaticamente, baseado na duração
        type: Sequelize.DATE,
        // allowNull: false,
      },
      price: {
        // Calculado automaticamente (price*duration)
        type: Sequelize.DECIMAL(10, 2),
        // allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('registers');
  },
};
