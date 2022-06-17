require("dotenv").config();
// npm packages
const express = require("express");
const app = express();
const { StatusCodes } = require("http-status-codes");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
// connect DB
const connectDB = require("./db/connectDB");
// middlewares
const notFoundMidWare = require("./middleware/not-found-midware");
const errorMidWare = require("./middleware/error-midware");
const authMidware = require("./middleware/auth-midware");
// routers
const authRouter = require("./routes/auth-route");
const jobsRouter = require("./routes/jobs-route");
// controllers
const factoryReset = require("./controllers/factory-reset-controller");
// mock data
const userData = require("./mock-data/users.json");
const jobData = require("./mock-data/jobs.json");

// security packages
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(express.json());

// swagger route
const swaggerDocument = YAML.load("./job-nuts-api-docs.yaml");
const options = {
  customSiteTitle: "Jobs API Docs",
};
app.use("/", swaggerUI.serve);
app.get("/", swaggerUI.setup(swaggerDocument, options));

// reset and mock data routes and functions
const mockData = [{ users: [...userData] }, { jobs: [...jobData] }];
app.post("/api/v1/factory-reset", factoryReset);
app.get("/api/v1/mock-data", (req, res) => res.status(200).send(mockData));

// main routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMidware, jobsRouter);
app.use(errorMidWare);
app.use(notFoundMidWare);

// connect port & db
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server listening to port: ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
