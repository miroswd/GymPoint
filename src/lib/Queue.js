import Bee from 'bee-queue';
import redisConfig from '../config/redis';

// Importing Jobs
import HelpOrderMail from '../app/jobs/HelpOrderMail';
import RegisterMail from '../app/jobs/RegisterMail';

const jobs = [HelpOrderMail, RegisterMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue}:FAILED`, err);
  }
}

export default new Queue();