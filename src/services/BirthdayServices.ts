import { Request, Response } from 'express';
import { User } from '../types/User.js';
import { BirthdayMessage } from '../types/Birthday.js';
import { 
  fetchAllUserBday,
  queueBirthdayUser
} from '../models/BirthdayModel.js';
// import { birthdatePublishedTopicToSNS } from '../models/BirthdayModel.js'; 
import { DateTime } from "luxon";


export const BirthdayCheckerGreeter = async (): Promise<User[]> => {
  const localDateTime = DateTime.now().setZone("utc");

  const localHourInUTC: string = localDateTime.toFormat("HH");
  const localMonthDay: string = localDateTime.toFormat("MM-dd");
  const localYear: string = localDateTime.toFormat("yyyy");

  const users: User[] = await fetchAllUserBday(localHourInUTC, localMonthDay,localYear);

  if(users.length > 0){
    await queueBirthdayUser(users, localMonthDay);
  }

  console.log(`Queued ${users.length} birthday users:`, users);
  return users;
};