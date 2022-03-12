const express = require("express"),
  mongoose = require("mongoose"),
  cors = require("cors"),
  app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://chnl:mshr@cluster0.sy61y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true,
    }
  )
  .then(() => console.log("DB is up"))
  .catch((err) => console.log(err));

app.use("/api", require("./routes/home"));
app.use("/api", require("./routes/candidates"));
app.use("/api", require("./routes/interview"));

app.listen(process.env.PORT || 3001, () => {
  console.log("Server running on 3001");
});
