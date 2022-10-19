import { parserFactory } from "../utils/parserFactory";

export const uberEatsParser = parserFactory({
  yearRegExp: /(\d+) \d\d:\d\d/,
  monthRegExp: /(\d+)\/\d+ \d\d:\d\d/,
  dayRegExp: /(\d+)\/\d+\/\d+ \d\d:\d\d/,
  amountRegExp: /Total PLN (\d+\.\d\d)/,
  memoRegExp: /Here's your receipt for (.*)\./,
});
