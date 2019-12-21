import Mail from '../../lib/Mail';

class HelpOrderMail {
  get key() {
    return 'HelpOrderMail';
  }

  async handle({ data }) {
    const { student, helpOrder } = data;

    await Mail.sendMail({
      to: `${student} ${student}`,
      subject: 'Question Answered',
      template: 'helporder',
      context: {
        student,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });
  }
}

export default new HelpOrderMail();
