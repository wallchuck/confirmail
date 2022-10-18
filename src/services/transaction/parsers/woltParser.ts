import { parserFactory } from "../utils/parserFactory";

export const woltParser = parserFactory({
  yearRegExp: /Delivery time \d+\.\d+\.(\d+)/,
  monthRegExp: /Delivery time \d+\.(\d+)/,
  dayRegExp: /Delivery time (\d+)/,
  amountRegExp: /Total in PLN \(incl. VAT\)\s\S(\d+\.\d\d)/,
  memoRegExp: /Venue (.*)/,
});
