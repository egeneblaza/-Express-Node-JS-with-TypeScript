import {
  DynamoDBClient,
  QueryCommand
} from "@aws-sdk/client-dynamodb";
import { User} from "../types/User.js"; 
import { BirthdayMessage } from '../types/Birthday.js';
import { unmarshall } from "@aws-sdk/util-dynamodb";
import {
  SQSClient,
  SendMessageBatchRequestEntry,
  SendMessageBatchCommand
} from "@aws-sdk/client-sqs";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const client = new DynamoDBClient({ region: process.env.AWS_Region });
const sqsClient = new SQSClient({ region: process.env.AWS_Region });
const snsClient = new SNSClient({ region: "ap-southeast-1" });



export const fetchAllUserBday = async (
    localHourInUTC: string,
    localMonthDay: string,
    localYear: string,
): Promise<User[]> => {
    const tableName = process.env.UserDetailsDynamoDBTable;
    const utcInHour_setReceivedYearToUse = `${localHourInUTC}_${localYear}`;
    if (!tableName) {
        throw new Error("UserDetailsDynamoDBTable is not defined");
    }
    console.log(utcInHour_setReceivedYearToUse);
    console.log(localMonthDay);
    const result = await client.send(
        new QueryCommand({
        TableName: tableName,
        IndexName: "BirthdayGSI-UTC",
        KeyConditionExpression:
            "monthAndDayOfBirth = :monthday AND utcInHour_setReceivedYear = :utcInHour_setReceivedYearToUse",
        ExpressionAttributeValues: {
            ":monthday": { S: localMonthDay },
            ":utcInHour_setReceivedYearToUse": { S: utcInHour_setReceivedYearToUse },
        },
        })
    );

    const users: User[] =
    result.Items?.map((item) => unmarshall(item) as User) ?? [];

    return users;
};

export const queueBirthdayUser = async (
  users: User[],
  monthDay: string
): Promise<User[]> => {
    const queueUrl = process.env.BirthdayGreetingQueueUrl;
    console.log(queueUrl);
    if (!queueUrl) {
        throw new Error("queueUrl is not defined");
    }
    const batches = chunkArray(users, 10); // Batch of 10
    for (const batch of batches) {
        const entries: SendMessageBatchRequestEntry[] = batch.map((user, index) => ({
        Id: `${user.id}-${index}`,
        MessageBody: JSON.stringify(user),
        MessageGroupId: "birthday-group", // Required for FIFO
        MessageDeduplicationId: `${user.id}-${monthDay}`, // FIFO dedup
        }));

        await sqsClient.send(
        new SendMessageBatchCommand({
            QueueUrl: queueUrl,
            Entries: entries,
        })
        );
    }
    return users;
};


const chunkArray = <T>(arr: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
};