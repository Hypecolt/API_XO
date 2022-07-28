const dotenv = require('dotenv')
const express = require('express')
const errorsMiddleware = require('./src/middleware/errorsMiddleware.js')
const usersRouter = require('./src/routes/userRoutes.js')
const gamesRouter = require('./src/routes/gamesRoutes.js')

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use("/users", usersRouter);
app.use("/games", gamesRouter);


app.use(errorsMiddleware);

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
