import { program } from "commander";
import fs from "fs";
import { simpleParser } from "mailparser";
import path from "path";

program
  .requiredOption("-i, --input <path>", "path to downloaded S3 object")
  .requiredOption("-n, --name <name>", "parser name")
  .parse();

const options = program.opts<{ input: string; name: string }>();

const data = fs.readFileSync(options.input, { encoding: "utf-8" });

simpleParser(data).then(({ text }) => {
  if (!text)
    throw new Error(
      `Error: invalid message text '${text}' in input file at '${options.input}'`
    );

  const parserFileData = `
import { parserFactory } from "../utils/parserFactory";

export const ${options.name} = parserFactory({
  // TODO
  yearRegExp: /./,
  monthRegExp: /./,
  dayRegExp: /./,
  amountRegExp: /./,
  memoRegExp: /./,
});
`;

  const testFileData = `
// TODO: Anonymize test data
import parseISO from "date-fns/parseISO";

import { TransactionDetails } from "../transaction.types";
import { ${options.name} } from "./${options.name}";

describe("${options.name}", () => {
  it("reads transaction details from message text", async () => {
    const messageText = \`
${text.trim()}\`;

    const transactionDetails: TransactionDetails = {
      // TODO
      date: parseISO(""),
      amount: 0,
      memo: "",
    };

    expect(${options.name}(messageText)).toStrictEqual(transactionDetails);
  });

  it("throws if date string cannot be parsed", async () => {
    const messageText = \`
${text.trim()}\`;

    expect(() => ${options.name}(messageText)).toThrow();
  });

  it("throws if amount string cannot be parsed", async () => {
    const messageText = \`
${text.trim()}\`;

    expect(() => ${options.name}(messageText)).toThrow();
  });
});
`;

  const parserFilesPath = path.join(
    __dirname,
    "services",
    "transaction",
    "parsers"
  );

  fs.writeFileSync(
    path.join(parserFilesPath, `${options.name}.ts`),
    parserFileData.trimStart()
  );
  fs.writeFileSync(
    path.join(parserFilesPath, `${options.name}.test.ts`),
    testFileData.trimStart()
  );
});
