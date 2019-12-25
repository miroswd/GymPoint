import Mail from '../../lib/Mail';

class HelpOrderMail {
  get key() {
    return 'HelpOrderMail'; // Unique key
  }

  async handle({ data }) {
    // Task to be performed
    const { student, helpOrder } = data;
      
    console.log("tarefa executada")
    
    await Mail.sendMail({
      to: `${student.name} ${student.email}`,
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
