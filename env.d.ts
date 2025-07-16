// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    AWS_Region: string;
    UserDetailsDynamoDBTable: string;
    BirthdayGreetingQueueUrl: string;
  }
}