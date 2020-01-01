// Importing modules
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';
import { Op } from 'sequelize';
// Importing models
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(400).json({ error: 'The student does not exists' });
    }
    const student_id = student.id;

    // Validating if the student checked today
    const today = new Date();
    const checkin = await Checkin.findOne({
      where: { student_id },
      created_at: {
        [Op]: [startOfDay(today), endOfDay(today)],
      },
    });

    if (checkin) {
      return res.status(401).json('The Student already checked in today');
    }

    // Validating if the student has attended the gym more than 5 times
    const count = await Checkin.count({
      where: { student_id },
      created_at: {
        [Op]: [startOfWeek(today), endOfWeek(today)],
      },
    });
    // console.log(`>>>>>>>>>>>>>>>>>>>>>> Number of check ins:${count} <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`);
    if (count === 5) {
      return res
        .status(401)
        .json('The Student has checked 5 times in this week');
    }

    await Checkin.create({ student_id });
    return res.json('Check in successfully');
  }
}
export default new CheckinController();
