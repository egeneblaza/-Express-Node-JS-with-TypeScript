import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
  DeleteItemCommand,
  ScanCommand
} from "@aws-sdk/client-dynamodb";
import { marshall,unmarshall } from "@aws-sdk/util-dynamodb";
import { User,DeleteUserParams } from "../types/User.js"; // Make sure this interface is properly defined

const client = new DynamoDBClient({ region: process.env.AWS_Region });
export const createUserToDB = async (data: User): Promise<PutItemCommandOutput> => {
  const tableName = process.env.UserDetailsDynamoDBTable;
  if (!tableName) throw new Error("UserDetailsDynamoDBTable is not defined");
  const params: PutItemCommandInput = {
    TableName: tableName,
    Item: marshall(data),
  };
  const command = new PutItemCommand(params);
  const result = await client.send(command);
  return result;
};

export const deleteUserByIdFromDB = async (
  userId: string
): Promise<{ id: string } | null> => {
  const tableName = process.env.UserDetailsDynamoDBTable;
  
  if (!tableName) throw new Error("UserDetailsDynamoDBTable is not defined");
  const params = {
    TableName: tableName,
    Key: {
      "id": { S: userId },
    },
    ReturnValues: 'ALL_OLD' as const,
  };
  console.log(params)
  const result = await client.send(new DeleteItemCommand(params));
   console.log(result)
  if (!result.Attributes) return null;

  const oldItem = unmarshall(result.Attributes);
  return { id: oldItem.id };
};


export const fetchAllUserFromDB = async (): Promise<User[]> => {
  const tableName = process.env.UserDetailsDynamoDBTable;
  if (!tableName) {
    throw new Error('UserDetailsDynamoDBTable is not defined');
  }
  const params = {
    TableName: tableName,
  };
  const command = new ScanCommand(params);
  const result = await client.send(command);
  const items = result.Items?.map(item => unmarshall(item) as User) || [];
  // console.log(items);
  return items;
};

