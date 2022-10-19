import { boltFoodParser } from "./parsers/boltFoodParser";
import { uberEatsParser } from "./parsers/uberEatsParser";
import { woltParser } from "./parsers/woltParser";
import {
  isPayee,
  MessageTextParser,
  Payee,
  Transaction,
} from "./transaction.types";

export const getPayee = (messageText: string): Payee => {
  const [, sender] = messageText.match(/From: (.*) </) ?? [];
  const [, subject] = messageText.match(/Subject: (.*)/) ?? [];

  if (isPayee(sender)) {
    return sender;
  }

  if (subject?.includes("Uber Eats")) {
    return "Uber Eats";
  }

  throw new Error(
    `Error: invalid payee '${sender}' in message text '${messageText}'`
  );
};

const parsersByPayee: Record<Payee, MessageTextParser> = {
  "Bolt Food": boltFoodParser,
  Wolt: woltParser,
  "Uber Eats": uberEatsParser,
};

const abbreviatedMemos: Record<string, string> = {
  "Salad Story - Al. KEN": "Salad Story",
  "Bao Dao - Wąwozowa": "Bao Dao",
  "Bajgle i Bąble Breakfast & Coffee bar": "Bajgle i Bąble",
  "KURA Buffalo Wings - Wilanów": "KURA Buffalo Wings",
  "McDonald's® - Ursynów": "McDonald's",
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
