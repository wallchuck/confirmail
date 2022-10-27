# confirmail

Confirmail is an AWS-based pet project that automates adding e-mail-confirmed transactions into [YNAB](https://www.youneedabudget.com) by following these steps:

1. A transaction confirmation e-mail is forwared to an address handled by [SES](https://aws.amazon.com/ses)
2. SES saves the e-mail into an [S3](https://aws.amazon.com/s3) bucket
3. A [Lambda](https://aws.amazon.com/lambda) parses the newly-added object using [mailparser](https://www.npmjs.com/package/mailparser) and determines the payee
4. Assuming consistent e-mail formatting for a given payee, the Lambda extracts the transaction amount and optionally a memo
5. The transaction details are saved using [YNAB API](https://api.youneedabudget.com/)

## Adding a Payee

1. Download a reference e-mail from S3
2. Scaffold the parser function and its tests by running the generator script:
    ```
    npm run generate-parser -- --input ~/path/to/reference --name myParser
    ```
3. Anonymize the data in `myParser.test.ts`
4. Start the test watcher (`npm run test:watch`) and make the tests green by:
   - Filling the expected transaction details in `myParser.test.ts` and providing correct [RegExps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) in `myParser.ts`
   - Updating `messageText` in the error-related test cases in `myParser.test.ts` to ensure that the parser throws when expected
7. Add the new payee to the `payees` array in `transaction.types.ts`
8. Add the new parser to the `parsersByPayee` dictionary in `transaction.service.ts`
9. If the payee is not the sender, update `getPayee` in `transaction.service.ts` and add an appropriate test case
