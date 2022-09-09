import type { S3Event } from "aws-lambda";

import { s3Service } from "./services/s3/s3.service";
import { transactionService } from "./services/transaction/transaction.service";
import { ynabService } from "./services/ynab/ynab.service";

export const handler = async (event: S3Event) => {
  const messageText = await s3Service.getMessageText(event);
  const transaction = transactionService.getTransaction(messageText);

  // eslint-disable-next-line no-console
  console.log(
    `Parsed message text to transaction '${JSON.stringify(transaction)}'`
  );

  await ynabService.saveTransaction({
    date: transaction.date.toISOString(),
    amount: transaction.amount * 1000,
    payee_name: transaction.payee,
    memo: transaction.memo ?? null,
  });

  // eslint-disable-next-line no-console
  console.log(`Saved transaction '${JSON.stringify(transaction)}'`);

  return transaction;
};
