const router = require("express").Router(),
  Interview = require("../models/Interview");
mailHandler = require("../utils/mailing");

router.get("/interview/:id", (req, res) => {
  Interview.findById(req.params.id)
    .populate("interviewees")
    .populate("interviewers")
    .then((interview) => {
      res.send({ success: true, interview: interview });
    })
    .catch((err) => {
      res.send({ success: false, err: err });
    });
});

function overlap(oldinterview, interview) {
  return (
    (oldinterview.startTime.getTime() >= interview.startTime.getTime() &&
      oldinterview.startTime.getTime() <= interview.endTime.getTime()) ||
    (oldinterview.endTime.getTime() >= interview.startTime.getTime() &&
      oldinterview.endTime.getTime() <= interview.endTime.getTime()) ||
    (interview.startTime.getTime() >= oldinterview.startTime.getTime() &&
      interview.startTime.getTime() <= oldinterview.endTime.getTime()) ||
    (interview.endTime.getTime() >= oldinterview.startTime.getTime() &&
      interview.endTime.getTime() <= oldinterview.endTime.getTime())
  );
}

router.post("/scheduleinterview", (req, res) => {
  let interview = {
    name: req?.body?.name,
    date: new Date(req?.body?.date),
    startTime: new Date(
      req?.body?.date + "T" + req?.body?.startTime + ":00.000Z"
    ),
    endTime: new Date(req?.body?.date + "T" + req?.body?.endTime + ":00.000Z"),
    interviewers: req?.body?.interviewers,
    interviewees: req?.body?.interviewees,
  };
  var possible = true;
  interview.interviewees.forEach((interviewee) => {
    Interview.find({ interviewees: interviewee })
      .then((oldinterviews) => {
        oldinterviews.forEach((oldinterview) => {
          if (overlap(oldinterview, interview)) {
            possible = false;
          }
        });
      })
      .then(() => {
        if (possible) {
          interview.interviewers.forEach((interviewer) => {
            Interview.find({ interviewers: interviewer })
              .then((oldinterviews) => {
                oldinterviews.forEach((oldinterview) => {
                  if (overlap(oldinterview, interview)) {
                    possible = false;
                  }
                });
              })
              .then(() => {
                if (possible) {
                  Interview.create(interview)
                    .then((interview) => {
                      possible = false;
                      mailHandler(interview);
                      res.send({ success: true, interview: interview });
                    })
                    .catch((err) => {
                      if (possible) {
                        possible = false;
                        res.send({ success: false, err: err });
                      }
                    });
                } else {
                  res.send({
                    success: true,
                    conflict: "upper",
                  });
                }
              })
              .catch((err) => {
                if (possible) {
                  possible = false;
                  res.send({ success: false, err: err });
                }
              });
          });
        } else {
          res.send({
            success: true,
            conflict: true,
          });
        }
      })
      .catch((err) => {
        if (possible) res.send({ success: false, err: err });
      });
  });
});

router.put("/updateinterview", (req, res) => {
  let interview = {
    id: req.body._id,
    name: req?.body?.name,
    date: new Date(req?.body?.date),
    startTime: new Date(
      req?.body?.date + "T" + req?.body?.startTime + ":00.000Z"
    ),
    endTime: new Date(req?.body?.date + "T" + req?.body?.endTime + ":00.000Z"),
    interviewers: req?.body?.interviewers,
    interviewees: req?.body?.interviewees,
  };
  var possible = true;
  interview.interviewees.forEach((interviewee) => {
    Interview.find({ interviewees: interviewee })
      .then((oldinterviews) => {
        oldinterviews.forEach((oldinterview) => {
          if (
            interview.id != oldinterview._id &&
            overlap(oldinterview, interview)
          ) {
            possible = false;
          }
        });
      })
      .then(() => {
        if (possible) {
          interview.interviewers.forEach((interviewer) => {
            Interview.find({ interviewers: interviewer })
              .then((oldinterviews) => {
                oldinterviews.forEach((oldinterview) => {
                  if (
                    interview.id != oldinterview._id &&
                    overlap(oldinterview, interview)
                  ) {
                    possible = false;
                  }
                });
              })
              .then(() => {
                if (possible) {
                  Interview.findByIdAndUpdate(interview.id, interview)
                    .then((interview) => {
                      possible = false;
                      mailHandler(interview);
                      res.send({ success: true, interview: interview });
                    })
                    .catch((err) => {
                      if (possible) {
                        possible = false;
                        res.send({ success: false, err: err });
                      }
                    });
                } else {
                  res.send({
                    success: true,
                    conflict: false,
                  });
                }
              })
              .catch((err) => {
                if (possible) {
                  possible = false;
                  res.send({ success: false, err: err });
                }
              });
          });
        } else {
          res.send({
            success: true,
            conflict: true,
          });
        }
      })
      .catch((err) => {
        if (possible) res.send({ success: false, err: err });
      });
  });
});

router.delete("/deleteinterview/:id", (req, res) => {
  Interview.findByIdAndDelete(req.params.id)
    .then((interview) => {
      res.send({ success: true, interview: interview });
    })
    .catch((err) => {
      res.send({ success: false, err: err });
    });
});

module.exports = router;
