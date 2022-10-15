import isValid from "date-fns/isValid";
import parseISO from "date-fns/parseISO";

import type { MessageTextParser } from "../transaction.types";

type ParserFactoryParams = {
  yearRegExp: RegExp;
  monthRegExp: RegExp;
  dayRegExp: RegExp;
  amountRegExp: RegExp;
  memoRegExp?: RegExp;
};

export const parserFactory = ({
  dayRegExp,
  monthRegExp,
  yearRegExp,
  amountRegExp,
  memoRegExp,
}: ParserFactoryParams): MessageTextParser => {
  return (messageText) => {
    const [, year] = messageText.match(yearRegExp) ?? [];
    const [, month] = messageText.match(monthRegExp) ?? [];
    const [, day] = messageText.match(dayRegExp) ?? [];
    const dateString = `${year}-${month}-${day}`;
    const date = parseISO(dateString);

    if (!isValid(date)) {
      throw new Error(`Error: cannot parse date string '${dateString}'`);
    }

    const [, amountString] = messageText.match(amountRegExp) ?? [];
    const amount = Number(amountString);

    if (Number.isNaN(amount)) {
      throw new Error(`Error: cannot parse amount string  '${amountString}'`);
    }

    const [, memo] = memoRegExp ? messageText.match(memoRegExp) ?? [] : [];

    return { date, amount, memo };
  };
};
