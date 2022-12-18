import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import privateRoute from "./routes/privateRoute.js";
// Add Error.js
import errorHandler from "./middleware/error.js";

const app = express();

// Middleware
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));
app.use(cors());


// Routes
app.use("/", authRoute);
app.use("/private", privateRoute);

// ErrorHandler (should be last piece of middleware)
app.use(errorHandler);


export default app;