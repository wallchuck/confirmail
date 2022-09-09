import isValid from "date-fns/isValid";
import parseISO from "date-fns/parseISO";

import type { TransactionDetails } from "../transaction.types";

export const boltFoodParser = (messageText: string): TransactionDetails => {
  const [, day, month, year] =
    messageText.match(/\u00AD(\d+)\.(\d+)\.(\d+)/) ?? [];
  const dateString = `${year}-${month}-${day}`;
  const date = parseISO(dateString);

  if (!isValid(date)) {
    throw new Error(`Error: cannot parse date string '${dateString}'`);
  }

  const [, amountString] =
    messageText.match(/Total charged:[\S\s]*?(\d+[\d\s]*\.\d\d)/) ?? [];
  const amount = Number(amountString);

  if (Number.isNaN(amount)) {
    throw new Error(`Error: cannot parse amount string  '${amountString}'`);
  }

  const [, memo] = messageText.match(/From (.*) \u00AD/) ?? [];

  return { date, amount, memo };
};
