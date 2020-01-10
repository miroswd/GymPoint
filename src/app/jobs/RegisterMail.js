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
      subject: 'Welcome to GymPoint',
      template: 'welcome',
      context: {
        name: student.name,
        firstDay: format(parseISO(register.start_date), 'PPPP'),
        lastDay: format(parseISO(register.end_date), 'PPPP'),
        duration: plan.duration,
        title: plan.title,
        price: register.price,
        id: student.id,
      },
    });
  }
}

export default new RegisterMail();
