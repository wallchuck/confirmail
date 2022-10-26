import { parserFactory } from "../utils/parserFactory";

export const upcParser = parserFactory({
  yearRegExp: /Data transakcji: (\d+)/,
  monthRegExp: /Data transakcji: \d+-(\d+)/,
  dayRegExp: /Data transakcji: \d+-\d+-(\d+)/,
  amountRegExp: /Łączna kwota:\n(\d+\.\d\d)/,
});
