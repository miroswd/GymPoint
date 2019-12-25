import { format, parseISO } from 'date-fns';
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
      context: {
        name: student.name,
        firstDay: format(parseISO(register.start_date), 'PPPP'),
        lastDay: format(parseISO(register.end_date), 'PPPP'),
        title: plan.title,
        price: register.price,
      },
    });
  }
}

export default new RegisterMail();
