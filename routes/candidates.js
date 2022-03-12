const router = require("express").Router(),
  Interviewee = require("../models/Interviewee"),
  Interviewer = require("../models/Interviewer");

router.post("/interviewee", (req, res) => {
  Interviewee.create({
    name: req.body.name,
    email: req.body.email,
  })
    .then((interviewee) => {
      res.send({ success: true, interviewee: interviewee });
    })
    .catch((err) => {
      res.send({ success: false, err: "Something went wrong!" });
    });
});

router.post("/interviewer", (req, res) => {
  Interviewer.create({
    name: req.body.name,
    email: req.body.email,
  })
    .then((interviewer) => {
      res.send({ success: true, interviewer: interviewer });
    })
    .catch((err) => {
      res.send({ success: false, err: "Something went wrong!" });
    });
});

router.get("/candidates", (req, res) => {
  Interviewer.find({})
    .then((interviewers) => {
      Interviewee.find({}).then((interviewees) => {
        res.send({
          success: true,
          interviewees: interviewees,
          interviewers: interviewers,
        });
      });
    })
    .catch((err) => {
      res.send({ success: false, err: err });
    });
});

module.exports = router;
