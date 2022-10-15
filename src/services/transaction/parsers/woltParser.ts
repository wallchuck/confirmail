import { parserFactory } from "../utils/parserFactory";

export const woltParser = parserFactory({
  yearRegExp: /Delivery time \d+\.\d+\.(\d+)/,
  monthRegExp: /Delivery time \d+\.(\d+)/,
  dayRegExp: /Delivery time (\d+)/,
  amountRegExp: /Total in PLN[\S\s]*?(\d+[\d\s]*\.\d\d)/,
  memoRegExp: /Venue (.*)/,
});
