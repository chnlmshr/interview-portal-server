const nodemailer = require("nodemailer"),
  Interviewee = require("../models/Interviewee"),
  Interviewer = require("../models/Interviewer");

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "e5d2a185ef6391",
    pass: "79ba6d8a23dc17",
  },
});

const mailHandler = async (interview) => {
  let mailingList = [];
  Interviewee.find({ _id: { $in: interview.interviewees } })
    .then((interviewees) => {
      Interviewer.find({ _id: { $in: interview.interviewees } })
        .then((interviewers) => {
          interviewees.forEach((interviewee) =>
            mailingList.push(interviewee.email)
          );
          interviewers.forEach((interviewer) =>
            mailingList.push(interviewer.email)
          );
          let mailOptions = {
            from: "19bcs1090@gmail.com",
            to: mailingList.toString(),
            subject: "Interview Schedule",
            text: `<b>Hello, </b><p>An interview is Scheduled for you on ${interview.date} from ${interview.startTime} to ${interview.endTime}</p><p>Regards,</p><p>Chanchal</p>`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mailHandler;
