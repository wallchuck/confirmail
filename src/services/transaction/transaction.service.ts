import { boltFoodParser } from "./parsers/boltFoodParser";
import { woltParser } from "./parsers/woltParser";
import {
  isPayee,
  MessageTextParser,
  Payee,
  Transaction,
} from "./transaction.types";

const getPayee = (messageText: string): Payee => {
  const [, payee] = messageText.match(/From: (.*) </) ?? [];

  if (!isPayee(payee)) {
    throw new Error(
      `Error: invalid payee '${payee}' in message text '${messageText}'`
    );
  }

  return payee;
};

const parsersByPayee: Record<Payee, MessageTextParser> = {
  "Bolt Food": boltFoodParser,
  Wolt: woltParser,
};

const abbreviatedMemos: Record<string, string> = {
  "Salad Story - Al. KEN": "Salad Story",
  "Bao Dao - Wąwozowa": "Bao Dao",
  "Bajgle i Bąble Breakfast & Coffee bar": "Bajgle i Bąble",
};

const getTransaction = (messageText: string): Transaction => {
  const payee = getPayee(messageText);
  const parse = parsersByPayee[payee];
  const { memo, ...transactionDetails } = parse(messageText);
  const abbreviatedMemo = memo && abbreviatedMemos[memo];

  return { ...transactionDetails, payee, memo: abbreviatedMemo ?? memo };
};

export const transactionService = {
  getTransaction,
};
