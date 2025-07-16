import { BirthdayCheckerGreeter} from '../services/BirthdayServices.js';
import { DateTime } from "luxon";
import { SQSEvent } from "aws-lambda";
import { User } from '../types/User.js';
import { Request, Response,RequestHandler  } from 'express';


export const birthdayCheckerController: RequestHandler = async (req, res) => {
  try {
    const users = await BirthdayCheckerGreeter();
    res.status(200).json({ message: 'Birthday check completed successfully.', users });
  } catch (err) {
    console.error('Error Birthday Checker and Greeter', err);
    res.status(500).json({ error: 'Internal server error in birthday checker.' });
  }
};