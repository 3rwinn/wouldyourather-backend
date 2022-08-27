import express, { Request, Response } from "express";
import { abort, verifyAuthToken } from "../middlewares/helpers";

import {
  Question,
  Answer,
  QuestionWithAnswer,
  QuestionStore,
} from "../models/question";

const QuestionController = (app: express.Application) => {
  app.post("/questions", verifyAuthToken, create);
  app.get("/questions", verifyAuthToken, index);
  app.get("/questions/:id", verifyAuthToken, show);
  app.delete("/questions/:id", verifyAuthToken, destroy);
  app.post("/questions/:id/answer", verifyAuthToken, answer);
};

const store = new QuestionStore();

const index = async (_req: Request, res: Response) => {
  const questions = await store.index();
  res.json({
    success: true,
    questions,
  });
};

const show = async (_req: Request, res: Response) => {
  const id = parseInt(_req.params.id);
  const question: QuestionWithAnswer = await store.show(id);

  if (question) {
    res.json({ success: true, question });
  } else {
    abort(res, 404, "Question not found");
  }
};

const create = async (_req: Request, res: Response) => {
  const question: Question = {
    author: _req.body.author,
    optionOne: _req.body.optionOne,
    optionTwo: _req.body.optionTwo,
  };

  try {
    const questionCreated: Question = await store.create(question);

    res.json({
      success: true,
      question: questionCreated,
    });
  } catch (err) {
    abort(res, 400);
  }
};

const destroy = async (_req: Request, res: Response) => {
  const id = parseFloat(_req.params.id);
  const deleted = await store.delete(id);
  if (deleted) {
    res.json({
      success: true,
      deleted,
    });
  } else {
    abort(res, 404, "Question not found");
  }
};

const answer = async (_req: Request, res: Response) => {
  const question_id = parseInt(_req.params.id);
  const optionOneReq = _req.body.optionOne;
  const optionTwoReq = _req.body.optionTwo;

  try {
    const questionData = await store.show(question_id);

    if (questionData) {
      const { result } = questionData;
      const answerToAdd = {
        // @ts-ignore
        optionOne: optionOneReq ? optionOneReq : result.optionone,
        // @ts-ignore
        optionTwo: optionTwoReq ? optionTwoReq : result.optiontwo,
      };

      const finalResult: Answer = await store.addAnswer(
        question_id,
        answerToAdd.optionOne,
        answerToAdd.optionTwo
      );

      res.json({
        success: true,
        answer: finalResult,
      });
    } else {
      abort(res, 404, "Question not found");
    }
  } catch (err) {
    abort(res, 400);
  }
};

export default QuestionController;
