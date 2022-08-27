import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import UserController from "./controllers/userController";
import QuestionController from "./controllers/questionController";

const app: express.Application = express();
const address: string = "localhost:3003";

app.use(bodyParser.json());
app.use(cors());


app.get("/", function (req: Request, res: Response) {
  res.send("Hello World!");
});

UserController(app);
QuestionController(app);

app.listen(3003, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
