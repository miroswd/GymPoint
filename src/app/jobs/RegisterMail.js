import Mail from '../../lib/Mail';

class RegisterMail {
  get key() {
    return 'RegisterMail';
  }

  async handle({ data }) {
    const { student, plan, register } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Bem-vindo(a) ao GymPoint',
      template: 'welcome',
      context: {},
    });
  }
}

export default new RegisterMail();
