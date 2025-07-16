export interface User {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  monthAndDayOfBirth: string;
  country: string;
  timezone: string;
  createdAt: string;
  utcInHour_setReceivedYear: string;

}

export interface UserInput {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
}

export interface DeleteUserParams {
  id: string;
}
