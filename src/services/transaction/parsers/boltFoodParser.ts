import { parserFactory } from "../utils/parserFactory";

export const boltFoodParser = parserFactory({
  yearRegExp: /\u00AD\d+\.\d+\.(\d+)/,
  monthRegExp: /\u00AD\d+\.(\d+)/,
  dayRegExp: /\u00AD(\d+)/,
  amountRegExp: /Total charged:[\S\s]*?(\d+\.\d\d)/,
  memoRegExp: /From (.*) \u00AD/,
});
