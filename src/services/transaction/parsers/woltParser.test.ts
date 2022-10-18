import parseISO from "date-fns/parseISO";

import { TransactionDetails } from "../transaction.types";
import { woltParser } from "./woltParser";

describe("woltParser", () => {
  it("reads transaction details from message text", async () => {
    const messageText = `
---------- Forwarded message ---------
From: Wolt <info@wolt.com>
Date: Wed, 7 Sept 2022 at 19:49
Subject: Your order’s confirmed: KURA Buffalo Wings - Wilanów 07.09.2022
To: <example@example.com>


Order confirmation #1662572875398 Order details
Customer John Doe
Order ID 6318cfd5206817a9e33f39ed
Venue KURA Buffalo Wings - Wilanów
Order type Delivery
Delivery time 07.09.2022 19:47 Payment method
Apple Pay ‎103.49
Item VAT % Quantity Net unit price Gross unit price Price
Kubeł 15 stripsów ‎93.00
Kubeł 15 stripsów 8% 1 ‎86.11 ‎93.00 ‎93.00
Sos do wyboru: BBQ 8% 1 ‎0.00 ‎0.00 ‎0.00
Sos do wyboru: Mango-BBQ 🌶️ 8% 1 ‎0.00 ‎0.00 ‎0.00
Dip do wyboru: Blue Cheese 8% 1 ‎0.00 ‎0.00 ‎0.00
Dip do wyboru: Ranch 8% 1 ‎0.00 ‎0.00 ‎0.00
Surówka: Zamień surówkę na więcej frytek 8% 1 ‎0.00 ‎0.00 ‎0.00
Delivery 8% 1 ‎9.25 ‎9.99 ‎9.99
Service fee 8% 1 ‎0.46 ‎0.50 ‎0.50
Total in PLN (incl. VAT) ‎103.49
Net price VAT Total
VAT 8% ‎95.82 ‎7.67 ‎103.49
Seller details: Mateusz Wawro Restauracja "KURA"
Business ID: 147154960
VAT ID: PL1181908323
Address: Gwiaździsta 21/91, 01-651 Warsaw, POL
This order confirmation is not a tax invoice. The tax invoice will be
issued by the seller and sent with the order.
This document is digitally signed.`;

    const transactionDetails: TransactionDetails = {
      date: parseISO("2022-09-07"),
      amount: 103.49,
      memo: "KURA Buffalo Wings - Wilanów",
    };

    expect(woltParser(messageText)).toStrictEqual(transactionDetails);
  });

  it("throws if date string cannot be parsed", async () => {
    const messageText = `
---------- Forwarded message ---------
From: Wolt <info@wolt.com>
Date: Wed, 7 Sept 2022 at 19:49
Subject: Your order’s confirmed: KURA Buffalo Wings - Wilanów 07.09.2022
To: <example@example.com>


Order confirmation #1662572875398 Order details
Customer John Doe
Order ID 6318cfd5206817a9e33f39ed
Venue KURA Buffalo Wings - Wilanów
Order type Delivery
Delivery time 07/09/2022 19:47 Payment method
Apple Pay ‎103.49
Item VAT % Quantity Net unit price Gross unit price Price
Kubeł 15 stripsów ‎93.00
Kubeł 15 stripsów 8% 1 ‎86.11 ‎93.00 ‎93.00
Sos do wyboru: BBQ 8% 1 ‎0.00 ‎0.00 ‎0.00
Sos do wyboru: Mango-BBQ 🌶️ 8% 1 ‎0.00 ‎0.00 ‎0.00
Dip do wyboru: Blue Cheese 8% 1 ‎0.00 ‎0.00 ‎0.00
Dip do wyboru: Ranch 8% 1 ‎0.00 ‎0.00 ‎0.00
Surówka: Zamień surówkę na więcej frytek 8% 1 ‎0.00 ‎0.00 ‎0.00
Delivery 8% 1 ‎9.25 ‎9.99 ‎9.99
Service fee 8% 1 ‎0.46 ‎0.50 ‎0.50
Total in PLN (incl. VAT) ‎103.49
Net price VAT Total
VAT 8% ‎95.82 ‎7.67 ‎103.49
Seller details: Mateusz Wawro Restauracja "KURA"
Business ID: 147154960
VAT ID: PL1181908323
Address: Gwiaździsta 21/91, 01-651 Warsaw, POL
This order confirmation is not a tax invoice. The tax invoice will be
issued by the seller and sent with the order.
This document is digitally signed.`;

    expect(() => woltParser(messageText)).toThrow();
  });

  it("throws if amount string cannot be parsed", async () => {
    const messageText = `
---------- Forwarded message ---------
From: Wolt <info@wolt.com>
Date: Wed, 7 Sept 2022 at 19:49
Subject: Your order’s confirmed: KURA Buffalo Wings - Wilanów 07.09.2022
To: <example@example.com>


Order confirmation #1662572875398 Order details
Customer John Doe
Order ID 6318cfd5206817a9e33f39ed
Venue KURA Buffalo Wings - Wilanów
Order type Delivery
Delivery time 07.09.2022 19:47 Payment method
Apple Pay ‎103.49
Item VAT % Quantity Net unit price Gross unit price Price
Kubeł 15 stripsów ‎93.00
Kubeł 15 stripsów 8% 1 ‎86.11 ‎93.00 ‎93.00
Sos do wyboru: BBQ 8% 1 ‎0.00 ‎0.00 ‎0.00
Sos do wyboru: Mango-BBQ 🌶️ 8% 1 ‎0.00 ‎0.00 ‎0.00
Dip do wyboru: Blue Cheese 8% 1 ‎0.00 ‎0.00 ‎0.00
Dip do wyboru: Ranch 8% 1 ‎0.00 ‎0.00 ‎0.00
Surówka: Zamień surówkę na więcej frytek 8% 1 ‎0.00 ‎0.00 ‎0.00
Delivery 8% 1 ‎9.25 ‎9.99 ‎9.99
Service fee 8% 1 ‎0.46 ‎0.50 ‎0.50
Total in PLN (incl. VAT) ‎103,49
Net price VAT Total
VAT 8% ‎95.82 ‎7.67 ‎103.49
Seller details: Mateusz Wawro Restauracja "KURA"
Business ID: 147154960
VAT ID: PL1181908323
Address: Gwiaździsta 21/91, 01-651 Warsaw, POL
This order confirmation is not a tax invoice. The tax invoice will be
issued by the seller and sent with the order.
This document is digitally signed.`;

    expect(() => woltParser(messageText)).toThrow();
  });
});
