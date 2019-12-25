import Mail from '../../lib/Mail';

class HelpOrderMail {
  get key() {
    return 'HelpOrderMail';
  }

  async handle({ data }) {
    const { student, helpOrder } = data;
    console.log('Chegou até aqui');
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Question Answered',
      template: 'helporder',
      context: {
        name: student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });
  }
}

export default new HelpOrderMail();
