const express = require("express");
const cors = require("cors");
const app = express();
const userAuthRoute = require("./routes/userAuthRoutes");
const restaurantRoute = require("./routes/restaurantRoutes");
const cron = require("node-cron");
const axios = require("axios");
const moment = require("moment-timezone");

const port = 3000;

app.use(cors());
app.use("*", cors());
app.use(express.json());

//API Routes
app.use("/v1/users", userAuthRoute);
app.use("/v1/restaurants", restaurantRoute);

//Beyond the world
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("*", (req, res) => {
  res.send("You have travelled beyond our world! Page not found!");
});

//App listen
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

// Sequelize Configuration
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("test2", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

// Import Sequelize models
const User = require("./models/user")(sequelize);
const Restaurants = require("./models/restaurants")(sequelize);

// Synchronize Sequelize models with the database
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection to database has been established successfully!");
    await sequelize.sync();
    console.log("Sequelize models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// Scheduled Jobs
cron.schedule(
  "* * * * * *",
  async () => {
    try {
      const users = await User.findAll();
      for (const user of users) {
        if (user.isJobScheduled) {
          console.log("Job Scheduled");
        }
        const localTime = moment().tz(user.timezone).format("HH:mm:ss");
        const dateNow = moment().tz(user.timezone).format("MM-DD");
        full_name = user.first_name + " " + user.last_name;
        const dateObj = new Date(user.dob);
        const formattedDate = moment(dateObj).format("MM-DD");

        if (localTime === "14:29:00" && dateNow === formattedDate) {
          const body = `Hey, ${full_name} it’s your birthday`;
          await axios.post(
            "https://eosr4f9uaga8gmo.m.pipedream.net",
            body
          );

          await User.update({ isJobScheduled: false }, { where: { id: user.id } });
        }

        await User.update({ isJobScheduled: true }, { where: { id: user.id } });
      }
    } catch (error) {
      console.error("Error running scheduled jobs:", error);
    }
  },
  {
    scheduled: true,
  }
);

module.exports = app;
