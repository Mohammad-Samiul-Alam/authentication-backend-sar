import app from "./app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({path: "config/config.env"});

const port = process.env.PORT || 5001;
const mongo = process.env.MONGO;

mongoose.connect(mongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> {
    app.listen(port, ()=> {
        console.log(`Server is running on http://localhost:${port}`);
    })
}).catch(error=>console.log(error));

// process.on("unhandledRejection", (err, promise)=> {
//     console.log(`Logged Error: ${err}`);
//     server.close(()=> process.exit(1));
// })

// 1st errorHandling.js
// 2nd error.js
// 3rd authentication middleware
// 4th json web token

//{
// To Create Jsonwebtoken{
    // command: 1.node, 2.require('crypto').randomBytes(35).toString('hex')
// }
// }

// 5th authProtectedMiddleware js

// 6th ForgotPassword Controller
// 7th Send Email js(https://sendgrid.com/)