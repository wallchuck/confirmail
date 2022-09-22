import parseISO from "date-fns/parseISO";

import { TransactionDetails } from "../transaction.types";
import { woltParser } from "./woltParser";

describe("woltParser", () => {
  it("reads transaction details from message text", async () => {
    const messageText = `
      ---------- Forwarded message ---------
      From: Wolt <info@wolt.com>
      Date: Sun, 18 Sept 2022 at 10:44
      Subject: Your order’s confirmed: Bajgle i Bąble Breakfast & Coffee bar
      18.09.2022
      To: <example@example.com> 
      
      
      Order confirmation #1663490614210 Order details
      Customer John Doe
      Order ID 6326d14caec44642df1581aa
      Venue Bajgle i Bąble Breakfast & Coffee bar
      Order type Delivery
      Delivery time 18.09.2022 10:43 Payment method
      Apple Pay ‎71.49
      Item VAT % Quantity Net unit price Gross unit price Price
      Jaja wiedeńskie z twarożkiem ze szczypiorkiem i rzodkiewką ‎31.00
      Jaja wiedeńskie z twarożkiem ze szczypiorkiem i rzodkiewką 8% 1 ‎23.15
      ‎25.00 ‎25.00
      Koszto opakowania: Opakowanie - jaja w słoiku 8% 1 ‎5.56 ‎6.00 ‎6.00
      Chałka z jajkiem poche ‎30.00
      Chałka z jajkiem poche 8% 1 ‎26.85 ‎29.00 ‎29.00
      Koszt opakowania: Opakowanie 8% 1 ‎0.93 ‎1.00 ‎1.00
      Delivery 8% 1 ‎9.25 ‎9.99 ‎9.99
      Service fee 8% 1 ‎0.46 ‎0.50 ‎0.50
      Total in PLN (incl. VAT) ‎71.49
      Net price VAT Total
      VAT 8% ‎66.20 ‎5.29 ‎71.49
      Seller details: KUŹNIA KULTURALNA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ
      Business ID: 369049032
      VAT ID: PL9512452589
      Address: Stanisława Kostki Potockiego 24, 02-952 Warszawa, POL
      This order confirmation is not a tax invoice. The tax invoice will be
      issued by the seller and sent with the order.
      This document is digitally signed.    
    `;

    const transactionDetails: TransactionDetails = {
      date: parseISO("2022-09-18"),
      amount: 71.49,
      memo: "Bajgle i Bąble Breakfast & Coffee bar",
    };

    expect(woltParser(messageText)).toStrictEqual(transactionDetails);
  });

  it("throws if date string cannot be parsed", async () => {
    const messageText = `
      ---------- Forwarded message ---------
      From: Wolt <info@wolt.com>
      Date: Sun, 18 Sept 2022 at 10:44
      Subject: Your order’s confirmed: Bajgle i Bąble Breakfast & Coffee bar
      18.09.2022
      To: <example@example.com> 
      
      
      Order confirmation #1663490614210 Order details
      Customer John Doe
      Order ID 6326d14caec44642df1581aa
      Venue Bajgle i Bąble Breakfast & Coffee bar
      Order type Delivery
      Delivery time 09.18.2022 10:43 Payment method
      Apple Pay ‎71.49
      Item VAT % Quantity Net unit price Gross unit price Price
      Jaja wiedeńskie z twarożkiem ze szczypiorkiem i rzodkiewką ‎31.00
      Jaja wiedeńskie z twarożkiem ze szczypiorkiem i rzodkiewką 8% 1 ‎23.15
      ‎25.00 ‎25.00
      Koszto opakowania: Opakowanie - jaja w słoiku 8% 1 ‎5.56 ‎6.00 ‎6.00
      Chałka z jajkiem poche ‎30.00
      Chałka z jajkiem poche 8% 1 ‎26.85 ‎29.00 ‎29.00
      Koszt opakowania: Opakowanie 8% 1 ‎0.93 ‎1.00 ‎1.00
      Delivery 8% 1 ‎9.25 ‎9.99 ‎9.99
      Service fee 8% 1 ‎0.46 ‎0.50 ‎0.50
      Total in PLN (incl. VAT) ‎71.49
      Net price VAT Total
      VAT 8% ‎66.20 ‎5.29 ‎71.49
      Seller details: KUŹNIA KULTURALNA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ
      Business ID: 369049032
      VAT ID: PL9512452589
      Address: Stanisława Kostki Potockiego 24, 02-952 Warszawa, POL
      This order confirmation is not a tax invoice. The tax invoice will be
      issued by the seller and sent with the order.
      This document is digitally signed.    
    `;

    expect(() => woltParser(messageText)).toThrow();
  });

  it("throws if amount string cannot be parsed", async () => {
    const messageText = `
      ---------- Forwarded message ---------
      From: Wolt <info@wolt.com>
      Date: Sun, 18 Sept 2022 at 10:44
      Subject: Your order’s confirmed: Bajgle i Bąble Breakfast & Coffee bar
      18.09.2022
      To: <example@example.com> 
      
      
      Order confirmation #1663490614210 Order details
      Customer John Doe
      Order ID 6326d14caec44642df1581aa
      Venue Bajgle i Bąble Breakfast & Coffee bar
      Order type Delivery
      Delivery time 18.09.2022 10:43 Payment method
      Apple Pay ‎71.49
      Item VAT % Quantity Net unit price Gross unit price Price
      Jaja wiedeńskie z twarożkiem ze szczypiorkiem i rzodkiewką ‎31.00
      Jaja wiedeńskie z twarożkiem ze szczypiorkiem i rzodkiewką 8% 1 ‎23.15
      ‎25.00 ‎25.00
      Koszto opakowania: Opakowanie - jaja w słoiku 8% 1 ‎5.56 ‎6.00 ‎6.00
      Chałka z jajkiem poche ‎30.00
      Chałka z jajkiem poche 8% 1 ‎26.85 ‎29.00 ‎29.00
      Koszt opakowania: Opakowanie 8% 1 ‎0.93 ‎1.00 ‎1.00
      Delivery 8% 1 ‎9.25 ‎9.99 ‎9.99
      Service fee 8% 1 ‎0.46 ‎0.50 ‎0.50
      Total (incl. VAT) ‎71.49
      Net price VAT Total
      VAT 8% ‎66.20 ‎5.29 ‎71.49
      Seller details: KUŹNIA KULTURALNA SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ
      Business ID: 369049032
      VAT ID: PL9512452589
      Address: Stanisława Kostki Potockiego 24, 02-952 Warszawa, POL
      This order confirmation is not a tax invoice. The tax invoice will be
      issued by the seller and sent with the order.
      This document is digitally signed.    
    `;

    expect(() => woltParser(messageText)).toThrow();
  });
});
