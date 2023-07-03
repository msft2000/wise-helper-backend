require("dotenv").config();
require("express-async-errors");

// Extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const express = require("express");
const app = express();

//connect to db
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

// routes
const authRoutes = require("./routes/auth");
const tareasRoutes = require("./routes/tareas");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standarHeaders: true,
        legacyHeaders: true,
    })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get("/", (req, res) => {
    res.send("<h1>Wise Helper API</h1>");
});

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tareas", authenticateUser, tareasRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();