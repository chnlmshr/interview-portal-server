const router = require("express").Router(),
  Interview = require("../models/Interview");

router.get("/home", (req, res) => {
  Interview.find({})
    .populate("interviewees")
    .populate("interviewers")
    .then((interviews) => {
      res.send({ success: true, interviews: interviews });
    })
    .catch((err) => {
      res.send({ success: false, err: err });
    });
});

module.exports = router;
