import parseISO from "date-fns/parseISO";

import { TransactionDetails } from "../transaction.types";
import { boltFoodParser } from "./boltFoodParser";

describe("boltFoodParser", () => {
  it("reads transaction details from message text", async () => {
    const messageText = `
---------- Forwarded message ---------
From: Bolt Food <poland-food@bolt.eu>
Date: Wed, 2 Mar 2022 at 18:48
Subject: Delivery from Bolt Food
To: <example@example.com>


­02.03.2022


*Bon Appetit, John!*

This is your receipt.
From Bistro Gruzińskie Granat ­Branickiego 10 lok.111
To ­Testowa 1, Warszawa, Polska

1 × Charczo

14.45 ZŁ

1 × Chinkali with Meat (4 pieces)

22.10 ZŁ

1 × Shoti

4.25 ZŁ

Delivery fee

7.44 ZŁ

*Total charged:*

*48.24 ZŁ*

•••• 0000

Download cost document Delivery
<https://delivery-invoicing.bolt.eu/invoice/pdf/?uuid=fd3abda4-54ac-469e-bb6d-b547a3acc002&l=gb&c=pl>
If you require an invoice for Food, please request it from the Seller.
Bolt Operations OÜ`;

    const transactionDetails: TransactionDetails = {
      date: parseISO("2022-03-02"),
      amount: 48.24,
      memo: "Bistro Gruzińskie Granat",
    };

    expect(boltFoodParser(messageText)).toStrictEqual(transactionDetails);
  });

  it("throws if date string cannot be parsed", async () => {
    const messageText = `
---------- Forwarded message ---------
From: Bolt Food <poland-food@bolt.eu>
Date: Wed, 2 Mar 2022 at 18:48
Subject: Delivery from Bolt Food
To: <example@example.com>


­02/03/2022


*Bon Appetit, John!*

This is your receipt.
From Bistro Gruzińskie Granat ­Branickiego 10 lok.111
To ­Testowa 1, Warszawa, Polska

1 × Charczo

14.45 ZŁ

1 × Chinkali with Meat (4 pieces)

22.10 ZŁ

1 × Shoti

4.25 ZŁ

Delivery fee

7.44 ZŁ

*Total charged:*

*48.24 ZŁ*

•••• 0000

Download cost document Delivery
<https://delivery-invoicing.bolt.eu/invoice/pdf/?uuid=fd3abda4-54ac-469e-bb6d-b547a3acc002&l=gb&c=pl>
If you require an invoice for Food, please request it from the Seller.
Bolt Operations OÜ`;

    expect(() => boltFoodParser(messageText)).toThrow();
  });

  it("throws if amount string cannot be parsed", async () => {
    const messageText = `
---------- Forwarded message ---------
From: Bolt Food <poland-food@bolt.eu>
Date: Wed, 2 Mar 2022 at 18:48
Subject: Delivery from Bolt Food
To: <example@example.com>


­02.03.2022


*Bon Appetit, John!*

This is your receipt.
From Bistro Gruzińskie Granat ­Branickiego 10 lok.111
To ­Testowa 1, Warszawa, Polska

1 × Charczo

14.45 ZŁ

1 × Chinkali with Meat (4 pieces)

22.10 ZŁ

1 × Shoti

4.25 ZŁ

Delivery fee

7.44 ZŁ

*Total charged:*

*48,24 ZŁ*

•••• 0000

Download cost document Delivery
<https://delivery-invoicing.bolt.eu/invoice/pdf/?uuid=fd3abda4-54ac-469e-bb6d-b547a3acc002&l=gb&c=pl>
If you require an invoice for Food, please request it from the Seller.
Bolt Operations OÜ`;

    expect(() => boltFoodParser(messageText)).toThrow();
  });
});
