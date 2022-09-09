import parseISO from "date-fns/parseISO";

import { transactionService } from "./transaction.service";
import { Transaction } from "./transaction.types";

describe("transaction.service", () => {
  describe("getTransaction", () => {
    it("reads transaction with abbreviated memo", async () => {
      const messageText = `
        ---------- Forwarded message --------- 
        From: Bolt Food <poland-food@bolt.eu> 
        Date: Mon, 8 Aug 2022 at 12:58 
        Subject: Delivery from Bolt Food 
        To: <example@example.com> 
        
        
        ­08.08.2022 
        
        
        *Bon Appetit, John!* 
        
        This is your receipt. 
        From Salad Story - Al. KEN ­Aleja Komisji Edukacji Narodowej 24/U-2 02-797 
        Warszawa 
        To ­Example Street 4/20, Warszawa, Polska 
        
        1 × Mango Salmon Salad XL Sezam 
        
        37.99 ZŁ 
        
        Delivery fee 
        
        2.49 ZŁ 
        
        *Total charged:* 
        
        *40.48 ZŁ* 
        
        •••• 0000 
        
        Download cost document Delivery 
        <https://delivery-invoicing.bolt.eu/invoice/pdf/?uuid=00000000-0000-0000-0000-000000000000&l=gb&c=pl> 
        If you require an invoice for Food, please request it from the Seller. 
        Bolt Operations OÜ
      `;

      const transaction: Transaction = {
        date: parseISO("2022-08-08"),
        amount: 40.48,
        memo: "Salad Story",
        payee: "Bolt Food",
      };

      expect(transactionService.getTransaction(messageText)).toStrictEqual(
        transaction
      );
    });
  });
});
