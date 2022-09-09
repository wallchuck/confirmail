import type { S3Event } from "aws-lambda";
import S3 from "aws-sdk/clients/s3";
import { simpleParser } from "mailparser";

const s3 = new S3();

const getMessageText = async (event: S3Event): Promise<string> => {
  const bucket = event.Records[0]?.s3.bucket.name;
  const key = event.Records[0]?.s3.object.key.replace(/\+/g, " ");

  if (!bucket || !key) {
    throw new Error(`Error: invalid bucket '${bucket}' and key '${key}' pair`);
  }

  const result = await s3
    .getObject({ Bucket: bucket, Key: decodeURIComponent(key) })
    .promise();

  if (!result.Body) {
    throw new Error(
      `Error: invalid result body '${result.Body}' from bucket '${bucket}' and key '${key}'`
    );
  }

  const { text } = await simpleParser(result.Body.toString("utf-8"));

  if (!text) {
    throw new Error(
      `Error: invalid message text '${text}' from bucket '${bucket}' and key '${key}'`
    );
  }

  return text;
};

export const s3Service = {
  getMessageText,
};
