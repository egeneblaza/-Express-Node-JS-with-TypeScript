import { v4 as uuidv4 } from 'uuid';
import { resolveCountry } from '../utils/countryCache.js';
import { DateTime } from 'luxon';
import { UserInput, User, DeleteUserParams } from '../types/User.js';
import { createUserToDB,deleteUserByIdFromDB,fetchAllUserFromDB } from '../models/UserModel.js'; 
import * as ct from 'countries-and-timezones';
import { UserId } from 'aws-sdk/clients/appstream';



export const createUserService = async (data: UserInput): Promise<User> => {
  const userId = `user_${uuidv4()}`;

  const country = resolveCountry(data.country);
  if (!country) {
    throw new Error(`Invalid country: "${data.country}". Use full name, CCA2, or CCA3.`);
  }
  const timezone = ct.getCountry(country.cca2)?.timezones[0] ?? 'UTC';
  const localTime = DateTime.now().setZone(timezone!);
  const dateOfBirth =  DateTime.fromISO(data.dateOfBirth).toFormat('yyyy-MM-dd');
  const monthAndDayOfBirth = DateTime.fromISO(data.dateOfBirth).toFormat('MM-dd');
  const currentUtcHour = DateTime.now().setZone("utc").toFormat('HH');
  const yearToUse = localTime.toFormat('MM-dd') >= monthAndDayOfBirth  ? localTime.year + 1 : localTime.year;
  const utcInHour_setReceivedYearToUse = `${currentUtcHour}_${yearToUse}`;
  
  const newUser:  User = {
    id: userId,
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: dateOfBirth,
    country: country.name,
    createdAt: localTime.toString(),
    timezone: timezone,
    monthAndDayOfBirth:monthAndDayOfBirth,
    utcInHour_setReceivedYear:utcInHour_setReceivedYearToUse
  };

  await createUserToDB(newUser); 

  return newUser;
};

export const deleteUserByIdService = async (userId: string): Promise<DeleteUserParams> => {
  const user = await deleteUserByIdFromDB(userId);
  if (!user) {
    throw new Error('User not found or unable to delete');
  }
  return user;
};

export const fetchAllUserDetails = async (): Promise<User[]> => {
  const users = await fetchAllUserFromDB();
  return users;
};

