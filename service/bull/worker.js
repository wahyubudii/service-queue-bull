import { sumValueQueue, verifyDocQueue } from "../../config/bull.js";
import Document from "../../models/Document.js";

export const bull = () => {
  sumValueQueue.process((job, done) => {
    console.log("[Q] SUM VALUE PROCESSING");

    const result = job.data.a + job.data.b;

    console.log(`SUM VALUE EXECUTED, RESULT: ${result}`);
    done();
  });

  verifyDocQueue.process(async (job, done) => {
    try {
      console.log("[Q] VERIF DOCUMENT PROCESSING");
      console.log(job.data);
      await Document.findByIdAndUpdate(
        job.data._id,
        {
          verifiedBy: job.data.adminId,
          status: 1,
        },
        { new: true }
      );

      console.log(`VERIFY DOCUMENT EXECUTED, RESULT: SUCCESS`);

      done();
    } catch (error) {
      console.error("Error updating document:", error);
      done();
    }
  });
};
