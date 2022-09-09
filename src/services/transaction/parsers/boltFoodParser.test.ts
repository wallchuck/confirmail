import parseISO from "date-fns/parseISO";

import { TransactionDetails } from "../transaction.types";
import { boltFoodParser } from "./boltFoodParser";

describe("boltFoodParser", () => {
  it("reads transaction details from message text", async () => {
    const messageText = `
      ---------- Forwarded message --------- 
      From: Bolt Food <poland-food@bolt.eu> 
      Date: Fri, 17 Jun 2022 at 13:39 
      Subject: Delivery from Bolt Food 
      To: <example@example.com> 


      ­17.06.2022 


      *Bon Appetit, John!* 

      This is your receipt. 
      From United India ­UL. KAROLA BORSUKA 21 
      To ­Example Street 4/20, Warszawa, Polska 

      1 × Prawns Papadi (8pcs) Packaging 

      32.20 ZŁ 

      Delivery fee 

      4.89 ZŁ 

      Small order fee 

      2.80 ZŁ 

      Campaign: XSKXNNN5X1DY6L6 

      -4.89 ZŁ 

      *Total charged:* 

      *35.00 ZŁ* 

      •••• 0000 

      Download cost document Delivery 
      <https://delivery-invoicing.bolt.eu/invoice/pdf/?uuid=00000000-0000-0000-0000-000000000000&l=gb&c=pl>
      If you require an invoice for Food, please request it from the Seller. 
      Bolt Operations OÜ
    `;

    const transactionDetails: TransactionDetails = {
      date: parseISO("2022-06-17"),
      amount: 35.0,
      memo: "United India",
    };

    expect(boltFoodParser(messageText)).toStrictEqual(transactionDetails);
  });

  it("throws if date string cannot be parsed", async () => {
    const messageText = `
      ---------- Forwarded message --------- 
      From: Bolt Food <poland-food@bolt.eu> 
      Date: Fri, 17 Jun 2022 at 13:39 
      Subject: Delivery from Bolt Food 
      To: <example@example.com> 


      17.06.2022 


      *Bon Appetit, John!* 

      This is your receipt. 
      From United India ­UL. KAROLA BORSUKA 21 
      To ­Example Street 4/20, Warszawa, Polska 

      1 × Prawns Papadi (8pcs) Packaging 

      32.20 ZŁ 

      Delivery fee 

      4.89 ZŁ 

      Small order fee 

      2.80 ZŁ 

      Campaign: XSKXNNN5X1DY6L6 

      -4.89 ZŁ 

      *Total charged:* 

      *35.00 ZŁ* 

      •••• 0000 

      Download cost document Delivery 
      <https://delivery-invoicing.bolt.eu/invoice/pdf/?uuid=00000000-0000-0000-0000-000000000000&l=gb&c=pl>
      If you require an invoice for Food, please request it from the Seller. 
      Bolt Operations OÜ
    `;

    expect(() => boltFoodParser(messageText)).toThrow();
  });

  it("throws if amount string cannot be parsed", async () => {
    const messageText = `
      ---------- Forwarded message --------- 
      From: Bolt Food <poland-food@bolt.eu> 
      Date: Fri, 17 Jun 2022 at 13:39 
      Subject: Delivery from Bolt Food 
      To: <example@example.com> 


      ­17.06.2022 


      *Bon Appetit, John!* 

      This is your receipt. 
      From United India ­UL. KAROLA BORSUKA 21 
      To ­Example Street 4/20, Warszawa, Polska 

      1 × Prawns Papadi (8pcs) Packaging 

      32.20 ZŁ 

      Delivery fee 

      4.89 ZŁ 

      Small order fee 

      2.80 ZŁ 

      Campaign: XSKXNNN5X1DY6L6 

      -4.89 ZŁ 

      *Total charged:* 

      *ZŁ* 

      •••• 0000 

      Download cost document Delivery 
      <https://delivery-invoicing.bolt.eu/invoice/pdf/?uuid=00000000-0000-0000-0000-000000000000&l=gb&c=pl>
      If you require an invoice for Food, please request it from the Seller. 
      Bolt Operations OÜ
    `;

    expect(() => boltFoodParser(messageText)).toThrow();
  });
});
