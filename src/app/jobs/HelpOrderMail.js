import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class HelpOrderMail {
  get key() {
    return 'HelpOrderMail'; // Unique key
  }

  async handle({ data }) {
    // Task to be performed
    const { student, helpOrder } = data;
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Question Answered',
      template: 'helporder',
      context: {
        name: student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
        create: format(parseISO(helpOrder.createdAt), 'PPPP'),
        update: format(parseISO(helpOrder.answer_at), 'PPPP'),
      },
    });
  }
}
export default new HelpOrderMail();
