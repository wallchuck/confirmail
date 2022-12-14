import parseISO from "date-fns/parseISO";

import { TransactionDetails } from "../transaction.types";
import { uberParser } from "./uberParser";

describe("uberParser", () => {
  it("reads transaction details from message text", async () => {
    const messageText = `
---------- Forwarded message ---------
From: Uber Receipts <noreply@uber.com>
Date: Sun, 10 Jul 2022 at 02:17
Subject: Your Sunday morning trip with Uber
To: <example@example.com>





Total PLN 44.59
10 July 2022



Thanks for riding, John
We hope you enjoyed your ride this morning.

Total PLN 44.59

Trip fare PLN 44.05

Subtotal PLN 44.05
Wait Time
<https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15UjLJqi79aYPwlG9ebBhI-2BjzlDzoIe4eyE-2BGu7Ngh4JAV5Mj4mFsJc3CE7GOiXQye5ZEWBbH-2FUz1nJCwoijOMiTcM0xHgvi1kjT5A65ukv4EKjkgvfsKsXf-2BjRbK-2FA1cQ6A-3D-3DtA2b_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzs9WT4QSZ9q7FdvrOkLdbxycLofw0o7UsqRAuAncT-2FzWNKNzqa6c19KTKXmVdBoQ8Rj92rj4rGdfySxyEKRELOPCrqDtUWz-2Fx3qp7iYHRH-2BWiFTNRZpyecRMfg-2Fi-2Fr44gYUj1ajoQHSlRQPtbv6XcYFD8-2BGW6yaTXRLOSYVLsnGkUXYrQsE-2BlHTKCbI8QuNUTA-3D-3D>
PLN 0.54

Payments
Apple Pay Mastercard ••••0000
10/07/2022 02:17 PLN 44.59
A temporary hold of PLN 44.05 was placed on your payment method Apple Pay
Mastercard ••••0000. This is not a charge and will be removed. It should
disappear from your bank statement shortly. Learn more
<https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15UjLJqi79aYPwlG9ebBhI-2BjzQRKXk-2BkHC8JHXsmguglHRmkzqEQBpgKmsFOo24-2BWx5RYrz6jjPTLwjpvvckelD1q0-2F2t13PPAIieAQo5oNfk5LDvgl5pjzXj2mbzyFvSoemTIukS1M6dVMvi2V9EfBKFibKBzFWS6mY-2Fju5mJwLBEBs18_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzopMGmOLPLTQa-2B4U8NM8TDgxyQ-2F8USIesxM3BLItA1h43VUfbVZ64P23mmLf-2BszyvGXe3lFic1iRxxKDXmwKSocsavNGsbB5QzB5nU8T1bDfNfxvdDdhCTamdKqLbu40qGkHpXRM65A1JeD5UAG-2BzXAQyIUrX5-2BWFnV-2ButMk3qrSF4AmABZo7oyKyvT3FW1-2FIg-3D-3D>
Visit the trip page
<https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRu6irGXXoQ6jD7qyl38Bcw0lxG5m2UqZkHH9u0md2OFy7ue0QTr7e2R-2Fdk2Y79sajo-3Dtg8q_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYziPbKfk6m-2BYtWSfEdqFD-2FJ-2BBvJ2c4pZC2S3PQBJdRAWWFaqO1YQ-2BG21X-2FBk3-2B0ghgRsVYb7SD5QX0GGSXKF-2F8j0JOUTrvkOrQiS5nTZ0Yn-2BLXa5rv3oz-2B1W1uJgj764tJl7Raud3WaP9LvPgc-2FOTyi5HBJ4X8oo9-2BEDZjLdW-2FIeIVxlaJJXW9bPR-2FXdUmDTZoQ-3D-3D>
for more information, including invoices (where available)
Download eReceipt as PDF
<https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRu6irGXXoQ6jD7qyl38Bcw0lxG5m2UqZkHH9u0md2OFy-2F0YNB8n4SiUQQ06eOytGJtykrQb5QgsPS2RILy-2BM1jmDu2AzWQjOhi7StWcCeFwTQ-3D-3DtCyy_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzg3hDM5YOTDUcNkT6QtAwgOIrZrD30C5p86Y6ejoG9mEhdy7MVzDAh7-2FqbcSGNm6Mfgkg1Gedfzb5kYNHWfrmfL9Jofueibtwm0IrVSTNWWR2uHdyuVZZcIqAdQwFKXTK4B0XRvnUwPtAkePoXgxMxZ1HYLu9VOdBJ-2Bd-2FDDlU0kHKC0FSwCTrjOCcuiFDOebgw-3D-3D>
Download eReceipt as JWS
<https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRu6irGXXoQ6jD7qyl38Bcw0lxG5m2UqZkHH9u0md2OFy-2F0YNB8n4SiUQQ06eOytGJsqmmLqff7SAc2l41QpXDACQrAlm7sr3WBJaBV9iM2d2Q-3D-3DIDo-_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzubP8NbeDD-2BLNXim-2FzpftGlQ3QduQ7tW2nAY5DnBfcAYvjcqyBZyG4s1t-2BFFA9oIEeQY6UJq6W9h-2B5GEUAb5W9oQte9SgxAoKGXtx1G3XI6aApcmx2nqr0kO6BC9qt8Nqlqxd1XMg6LO5cTugK0-2BQfyCciNDpG6esTCwXpfKhJlIEy6DCQAGHTrhmvsu-2BOzqJQ-3D-3D>

You rode with Dmytro
4.89 Rating

Rate or tip
<https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRu6irGXXoQ6jD7qyl38Bcw0lxG5m2UqZkHH9u0md2OFy7ue0QTr7e2R-2Fdk2Y79sajo-3DK94l_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzuje5bfcdqW2eqNPmuxt7PKi8QL0nH4c8rmRyNNSpFV6sLPcYf9W1NUldcM-2BnbaG7JJ-2BYiSCweZmBW9AahX197ek1OVAjZBfAL57Ng9x55XlvPUgDGoD4TmuJbMlmDifEb-2BGyR2Q6eOCGhHYKbTHQnB9pcAH3hFOL4Dx7xCNpnmhx71Lgbn-2FmjXBZUjagbCSHw-3D-3D>
This is not a tax invoice. This is a payment receipt for the transportation
service provided by INREDUSE SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ.


UberX
17.04 kilometres | 20 min(s)
01:56
Testowa 1, 00-000 Warszawa, Poland
02:17
Przykładowa 1, 00-000 Warszawa, Poland

Report lost item ❯
<https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15Uvsoaok85PvqCQ3QlNb6arQAsUWbSTnikFU6vUxSTt8vgm7RDagOhr04y1Xv44afdKpcqaLlJ3iJEcDlphulsDM-3DJekm_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzut8JqtCH9UYigMcKT7iteCOX2LwAfbNwN10HzWhMyms8fG0KFv6B7cdNvPAOJyikrv3MyCNBHLhnpYSLJ3gilipjsZxpf2q1GfQR8CQqDEeO3mLCPIFZHFWkqaT4j-2F2EqDZKf-2F2OEQrqwcL10pVbytk5nkw1nT730qJmIqiQOJG4CUhz80hwVtx73g7FzOnSg-3D-3D>


Contact support❯
<https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15UjnU1u7fTMJxOJIS1zPN1gI-3D-QjG_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzmerI8F8IjqXzeR6jkYY2PvlL-2FSaL0CB3lAlRR4WfEno3uyXsX0ecaREB7h7EoxFJ1zFSKTXOiLjaLAyFZ5rc6w3x-2BeDE3OZIA20Sv1o2cOWVjHyTARjTZtEQNUgesXtoxtdUtueArQ3a21yXNy1nODG2LSNLU95BUyFhaWFKkPJ8C3v6dclDMHWxBQMK50lAQ-3D-3D>

My trips ❯
<https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRshoZOO-2FR78Vytc-2FQoAWi93PfYS_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzovfEDe2FRLdoZ3zLs1-2ByIT7Xn59nRK-2FjH5cbyacxVtjbiHvpP3svQPcyRksN2wR6zRJRXfkoZdQ-2FZFDTHczEPApHKclC5WUOI8LWOUCdSLfpzZ9hrwSXQLTeBctRDwCeOjX39TM0KQTJNWSknA7jZBhfdSdNdXUs-2Fux4lLGUYVeVptEX-2FIfV6M-2Bq1bimXXoEA-3D-3D>



Forgotten password
<https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15UiEU1Z05tLORYDhCMvHDxMXp1-2FGrvQPqpo9EFNFs3mqmwnK9G-2F3FherPjzsICj7yM-2FK-2FJYue6uKR2EHeIe26RLwpFTiSq-2BB-2FMOIwXA4MEf4KzHSrwM9QQbMHeXFgqFXItep-2Bp1Kf9guqlEKa1wFayRA3nSyhHdpw0M5nDUB4Sy-2FJsESM7ZfaBkdKepvt8RTcsw-3D-3DA5YV_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzr5Y6CjV1jhBuz3dixT4ULvOcxVqtSY-2BHKgHpjce-2Ftt5V2PiCX6ciK9uWvbWPNLRkN7GKLvi3RyBNIdEyRoagEZcZjnVrotEScVtGt8NMg97nAmtS7VCAssrNyusKQZBhSDCBo4vUBTgm3ClpOYbrwSSJQuDO4cpk4hX3be7PAakwy2OhF4CDEpED4UCcBGXeA-3D-3D>
Privacy
<https://email.uber.com/ls/click?upn=Ib78WjkFQ66GYzavQJcfTaUW2mLjCZlesuzr-2FyzEQzDKq5PxwjJLnlhd3kWpjkC8zbzr_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzrS16eFBPrSuvEjiLKVbX7A0RoTdHhJwdCk2AmIBKR3oBXtUAfGhrYz1-2Fioyot55xXe3Xs3BGZJlgkXG6Fg0nUEnzT8Mun6-2FlEb2b-2BigC0-2Bs0RIlpSnIKjGrWwBzImYi7fceKwLz-2B9muSKCMHoV30OXIQGgsCFZCB1ueoNrVKzUqgezacElaGj2FR4VrHnyqVQ-3D-3D>
Terms
<https://email.uber.com/ls/click?upn=Ib78WjkFQ66GYzavQJcfTaUW2mLjCZlesuzr-2FyzEQzD9L-2F1tKRCOuyZn2F4t4pFGWOJ8_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzrr7Reuq34a24q4OH9MRBtB0E-2FZbM0laKOiHBEV2B-2BFXVNKs62P2Fm5Q9AEQezzRdyheBSL7McmH2xtP81bsal-2B9w3b-2BZaw14LHI0Yp2wzsf84Xu7sj4aFFRhVwQ7MFxbL-2F6dZM4CYZ1qhoCin-2BQX8NshnmCxdhYJkxF2OfZrzqDiahEP3WC5RtQu29wMEvX-2Bw-3D-3D>
Uber Poland sp. z o.o.
ul. Inflancka 4, 00-189 Warszawa

Fare does not include fees that may be charged by your bank. Please contact
your bank directly for inquiries.`;

    const transactionDetails: TransactionDetails = {
      date: parseISO("2022-07-10"),
      amount: 44.59,
      memo: undefined,
    };

    expect(uberParser(messageText)).toStrictEqual(transactionDetails);
  });

  it("throws if date string cannot be parsed", async () => {
    const messageText = `
---------- Forwarded message ---------
From: Uber Receipts <noreply@uber.com>
Date: Sun, 10 Jul 2022 at 02:17
Subject: Your Sunday morning trip with Uber
To: <example@example.com>





Total PLN 44.59
10 July 2022



Thanks for riding, John
We hope you enjoyed your ride this morning.

Total PLN 44.59

Trip fare PLN 44.05

Subtotal PLN 44.05
Wait Time
<https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15UjLJqi79aYPwlG9ebBhI-2BjzlDzoIe4eyE-2BGu7Ngh4JAV5Mj4mFsJc3CE7GOiXQye5ZEWBbH-2FUz1nJCwoijOMiTcM0xHgvi1kjT5A65ukv4EKjkgvfsKsXf-2BjRbK-2FA1cQ6A-3D-3DtA2b_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzs9WT4QSZ9q7FdvrOkLdbxycLofw0o7UsqRAuAncT-2FzWNKNzqa6c19KTKXmVdBoQ8Rj92rj4rGdfySxyEKRELOPCrqDtUWz-2Fx3qp7iYHRH-2BWiFTNRZpyecRMfg-2Fi-2Fr44gYUj1ajoQHSlRQPtbv6XcYFD8-2BGW6yaTXRLOSYVLsnGkUXYrQsE-2BlHTKCbI8QuNUTA-3D-3D>
PLN 0.54

Payments
Apple Pay Mastercard ••••0000
10-07-2022 02:17 PLN 44.59
A temporary hold of PLN 44.05 was placed on your payment method Apple Pay
Mastercard ••••0000. This is not a charge and will be removed. It should
disappear from your bank statement shortly. Learn more
<https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15UjLJqi79aYPwlG9ebBhI-2BjzQRKXk-2BkHC8JHXsmguglHRmkzqEQBpgKmsFOo24-2BWx5RYrz6jjPTLwjpvvckelD1q0-2F2t13PPAIieAQo5oNfk5LDvgl5pjzXj2mbzyFvSoemTIukS1M6dVMvi2V9EfBKFibKBzFWS6mY-2Fju5mJwLBEBs18_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzopMGmOLPLTQa-2B4U8NM8TDgxyQ-2F8USIesxM3BLItA1h43VUfbVZ64P23mmLf-2BszyvGXe3lFic1iRxxKDXmwKSocsavNGsbB5QzB5nU8T1bDfNfxvdDdhCTamdKqLbu40qGkHpXRM65A1JeD5UAG-2BzXAQyIUrX5-2BWFnV-2ButMk3qrSF4AmABZo7oyKyvT3FW1-2FIg-3D-3D>
Visit the trip page
<https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRu6irGXXoQ6jD7qyl38Bcw0lxG5m2UqZkHH9u0md2OFy7ue0QTr7e2R-2Fdk2Y79sajo-3Dtg8q_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYziPbKfk6m-2BYtWSfEdqFD-2FJ-2BBvJ2c4pZC2S3PQBJdRAWWFaqO1YQ-2BG21X-2FBk3-2B0ghgRsVYb7SD5QX0GGSXKF-2F8j0JOUTrvkOrQiS5nTZ0Yn-2BLXa5rv3oz-2B1W1uJgj764tJl7Raud3WaP9LvPgc-2FOTyi5HBJ4X8oo9-2BEDZjLdW-2FIeIVxlaJJXW9bPR-2FXdUmDTZoQ-3D-3D>
for more information, including invoices (where available)
Download eReceipt as PDF
<https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRu6irGXXoQ6jD7qyl38Bcw0lxG5m2UqZkHH9u0md2OFy-2F0YNB8n4SiUQQ06eOytGJtykrQb5QgsPS2RILy-2BM1jmDu2AzWQjOhi7StWcCeFwTQ-3D-3DtCyy_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzg3hDM5YOTDUcNkT6QtAwgOIrZrD30C5p86Y6ejoG9mEhdy7MVzDAh7-2FqbcSGNm6Mfgkg1Gedfzb5kYNHWfrmfL9Jofueibtwm0IrVSTNWWR2uHdyuVZZcIqAdQwFKXTK4B0XRvnUwPtAkePoXgxMxZ1HYLu9VOdBJ-2Bd-2FDDlU0kHKC0FSwCTrjOCcuiFDOebgw-3D-3D>
Download eReceipt as JWS
<https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRu6irGXXoQ6jD7qyl38Bcw0lxG5m2UqZkHH9u0md2OFy-2F0YNB8n4SiUQQ06eOytGJsqmmLqff7SAc2l41QpXDACQrAlm7sr3WBJaBV9iM2d2Q-3D-3DIDo-_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzubP8NbeDD-2BLNXim-2FzpftGlQ3QduQ7tW2nAY5DnBfcAYvjcqyBZyG4s1t-2BFFA9oIEeQY6UJq6W9h-2B5GEUAb5W9oQte9SgxAoKGXtx1G3XI6aApcmx2nqr0kO6BC9qt8Nqlqxd1XMg6LO5cTugK0-2BQfyCciNDpG6esTCwXpfKhJlIEy6DCQAGHTrhmvsu-2BOzqJQ-3D-3D>

You rode with Dmytro
4.89 Rating

Rate or tip
<https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRu6irGXXoQ6jD7qyl38Bcw0lxG5m2UqZkHH9u0md2OFy7ue0QTr7e2R-2Fdk2Y79sajo-3DK94l_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzuje5bfcdqW2eqNPmuxt7PKi8QL0nH4c8rmRyNNSpFV6sLPcYf9W1NUldcM-2BnbaG7JJ-2BYiSCweZmBW9AahX197ek1OVAjZBfAL57Ng9x55XlvPUgDGoD4TmuJbMlmDifEb-2BGyR2Q6eOCGhHYKbTHQnB9pcAH3hFOL4Dx7xCNpnmhx71Lgbn-2FmjXBZUjagbCSHw-3D-3D>
This is not a tax invoice. This is a payment receipt for the transportation
service provided by INREDUSE SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ.


UberX
17.04 kilometres | 20 min(s)
01:56
Testowa 1, 00-000 Warszawa, Poland
02:17
Przykładowa 1, 00-000 Warszawa, Poland

Report lost item ❯
<https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15Uvsoaok85PvqCQ3QlNb6arQAsUWbSTnikFU6vUxSTt8vgm7RDagOhr04y1Xv44afdKpcqaLlJ3iJEcDlphulsDM-3DJekm_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzut8JqtCH9UYigMcKT7iteCOX2LwAfbNwN10HzWhMyms8fG0KFv6B7cdNvPAOJyikrv3MyCNBHLhnpYSLJ3gilipjsZxpf2q1GfQR8CQqDEeO3mLCPIFZHFWkqaT4j-2F2EqDZKf-2F2OEQrqwcL10pVbytk5nkw1nT730qJmIqiQOJG4CUhz80hwVtx73g7FzOnSg-3D-3D>


Contact support❯
<https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15UjnU1u7fTMJxOJIS1zPN1gI-3D-QjG_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzmerI8F8IjqXzeR6jkYY2PvlL-2FSaL0CB3lAlRR4WfEno3uyXsX0ecaREB7h7EoxFJ1zFSKTXOiLjaLAyFZ5rc6w3x-2BeDE3OZIA20Sv1o2cOWVjHyTARjTZtEQNUgesXtoxtdUtueArQ3a21yXNy1nODG2LSNLU95BUyFhaWFKkPJ8C3v6dclDMHWxBQMK50lAQ-3D-3D>

My trips ❯
<https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRshoZOO-2FR78Vytc-2FQoAWi93PfYS_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzovfEDe2FRLdoZ3zLs1-2ByIT7Xn59nRK-2FjH5cbyacxVtjbiHvpP3svQPcyRksN2wR6zRJRXfkoZdQ-2FZFDTHczEPApHKclC5WUOI8LWOUCdSLfpzZ9hrwSXQLTeBctRDwCeOjX39TM0KQTJNWSknA7jZBhfdSdNdXUs-2Fux4lLGUYVeVptEX-2FIfV6M-2Bq1bimXXoEA-3D-3D>



Forgotten password
<https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15UiEU1Z05tLORYDhCMvHDxMXp1-2FGrvQPqpo9EFNFs3mqmwnK9G-2F3FherPjzsICj7yM-2FK-2FJYue6uKR2EHeIe26RLwpFTiSq-2BB-2FMOIwXA4MEf4KzHSrwM9QQbMHeXFgqFXItep-2Bp1Kf9guqlEKa1wFayRA3nSyhHdpw0M5nDUB4Sy-2FJsESM7ZfaBkdKepvt8RTcsw-3D-3DA5YV_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzr5Y6CjV1jhBuz3dixT4ULvOcxVqtSY-2BHKgHpjce-2Ftt5V2PiCX6ciK9uWvbWPNLRkN7GKLvi3RyBNIdEyRoagEZcZjnVrotEScVtGt8NMg97nAmtS7VCAssrNyusKQZBhSDCBo4vUBTgm3ClpOYbrwSSJQuDO4cpk4hX3be7PAakwy2OhF4CDEpED4UCcBGXeA-3D-3D>
Privacy
<https://email.uber.com/ls/click?upn=Ib78WjkFQ66GYzavQJcfTaUW2mLjCZlesuzr-2FyzEQzDKq5PxwjJLnlhd3kWpjkC8zbzr_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzrS16eFBPrSuvEjiLKVbX7A0RoTdHhJwdCk2AmIBKR3oBXtUAfGhrYz1-2Fioyot55xXe3Xs3BGZJlgkXG6Fg0nUEnzT8Mun6-2FlEb2b-2BigC0-2Bs0RIlpSnIKjGrWwBzImYi7fceKwLz-2B9muSKCMHoV30OXIQGgsCFZCB1ueoNrVKzUqgezacElaGj2FR4VrHnyqVQ-3D-3D>
Terms
<https://email.uber.com/ls/click?upn=Ib78WjkFQ66GYzavQJcfTaUW2mLjCZlesuzr-2FyzEQzD9L-2F1tKRCOuyZn2F4t4pFGWOJ8_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzrr7Reuq34a24q4OH9MRBtB0E-2FZbM0laKOiHBEV2B-2BFXVNKs62P2Fm5Q9AEQezzRdyheBSL7McmH2xtP81bsal-2B9w3b-2BZaw14LHI0Yp2wzsf84Xu7sj4aFFRhVwQ7MFxbL-2F6dZM4CYZ1qhoCin-2BQX8NshnmCxdhYJkxF2OfZrzqDiahEP3WC5RtQu29wMEvX-2Bw-3D-3D>
Uber Poland sp. z o.o.
ul. Inflancka 4, 00-189 Warszawa

Fare does not include fees that may be charged by your bank. Please contact
your bank directly for inquiries.`;

    expect(() => uberParser(messageText)).toThrow();
  });

  it("throws if amount string cannot be parsed", async () => {
    const messageText = `
---------- Forwarded message ---------
From: Uber Receipts <noreply@uber.com>
Date: Sun, 10 Jul 2022 at 02:17
Subject: Your Sunday morning trip with Uber
To: <example@example.com>





Total PLN 44,59
10 July 2022



Thanks for riding, John
We hope you enjoyed your ride this morning.

Total PLN 44,59

Trip fare PLN 44.05

Subtotal PLN 44.05
Wait Time
<https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15UjLJqi79aYPwlG9ebBhI-2BjzlDzoIe4eyE-2BGu7Ngh4JAV5Mj4mFsJc3CE7GOiXQye5ZEWBbH-2FUz1nJCwoijOMiTcM0xHgvi1kjT5A65ukv4EKjkgvfsKsXf-2BjRbK-2FA1cQ6A-3D-3DtA2b_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzs9WT4QSZ9q7FdvrOkLdbxycLofw0o7UsqRAuAncT-2FzWNKNzqa6c19KTKXmVdBoQ8Rj92rj4rGdfySxyEKRELOPCrqDtUWz-2Fx3qp7iYHRH-2BWiFTNRZpyecRMfg-2Fi-2Fr44gYUj1ajoQHSlRQPtbv6XcYFD8-2BGW6yaTXRLOSYVLsnGkUXYrQsE-2BlHTKCbI8QuNUTA-3D-3D>
PLN 0.54

Payments
Apple Pay Mastercard ••••0000
10/07/2022 02:17 PLN 44.59
A temporary hold of PLN 44.05 was placed on your payment method Apple Pay
Mastercard ••••0000. This is not a charge and will be removed. It should
disappear from your bank statement shortly. Learn more
<https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15UjLJqi79aYPwlG9ebBhI-2BjzQRKXk-2BkHC8JHXsmguglHRmkzqEQBpgKmsFOo24-2BWx5RYrz6jjPTLwjpvvckelD1q0-2F2t13PPAIieAQo5oNfk5LDvgl5pjzXj2mbzyFvSoemTIukS1M6dVMvi2V9EfBKFibKBzFWS6mY-2Fju5mJwLBEBs18_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzopMGmOLPLTQa-2B4U8NM8TDgxyQ-2F8USIesxM3BLItA1h43VUfbVZ64P23mmLf-2BszyvGXe3lFic1iRxxKDXmwKSocsavNGsbB5QzB5nU8T1bDfNfxvdDdhCTamdKqLbu40qGkHpXRM65A1JeD5UAG-2BzXAQyIUrX5-2BWFnV-2ButMk3qrSF4AmABZo7oyKyvT3FW1-2FIg-3D-3D>
Visit the trip page
<https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRu6irGXXoQ6jD7qyl38Bcw0lxG5m2UqZkHH9u0md2OFy7ue0QTr7e2R-2Fdk2Y79sajo-3Dtg8q_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYziPbKfk6m-2BYtWSfEdqFD-2FJ-2BBvJ2c4pZC2S3PQBJdRAWWFaqO1YQ-2BG21X-2FBk3-2B0ghgRsVYb7SD5QX0GGSXKF-2F8j0JOUTrvkOrQiS5nTZ0Yn-2BLXa5rv3oz-2B1W1uJgj764tJl7Raud3WaP9LvPgc-2FOTyi5HBJ4X8oo9-2BEDZjLdW-2FIeIVxlaJJXW9bPR-2FXdUmDTZoQ-3D-3D>
for more information, including invoices (where available)
Download eReceipt as PDF
<https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRu6irGXXoQ6jD7qyl38Bcw0lxG5m2UqZkHH9u0md2OFy-2F0YNB8n4SiUQQ06eOytGJtykrQb5QgsPS2RILy-2BM1jmDu2AzWQjOhi7StWcCeFwTQ-3D-3DtCyy_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzg3hDM5YOTDUcNkT6QtAwgOIrZrD30C5p86Y6ejoG9mEhdy7MVzDAh7-2FqbcSGNm6Mfgkg1Gedfzb5kYNHWfrmfL9Jofueibtwm0IrVSTNWWR2uHdyuVZZcIqAdQwFKXTK4B0XRvnUwPtAkePoXgxMxZ1HYLu9VOdBJ-2Bd-2FDDlU0kHKC0FSwCTrjOCcuiFDOebgw-3D-3D>
Download eReceipt as JWS
<https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRu6irGXXoQ6jD7qyl38Bcw0lxG5m2UqZkHH9u0md2OFy-2F0YNB8n4SiUQQ06eOytGJsqmmLqff7SAc2l41QpXDACQrAlm7sr3WBJaBV9iM2d2Q-3D-3DIDo-_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzubP8NbeDD-2BLNXim-2FzpftGlQ3QduQ7tW2nAY5DnBfcAYvjcqyBZyG4s1t-2BFFA9oIEeQY6UJq6W9h-2B5GEUAb5W9oQte9SgxAoKGXtx1G3XI6aApcmx2nqr0kO6BC9qt8Nqlqxd1XMg6LO5cTugK0-2BQfyCciNDpG6esTCwXpfKhJlIEy6DCQAGHTrhmvsu-2BOzqJQ-3D-3D>

You rode with Dmytro
4.89 Rating

Rate or tip
<https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRu6irGXXoQ6jD7qyl38Bcw0lxG5m2UqZkHH9u0md2OFy7ue0QTr7e2R-2Fdk2Y79sajo-3DK94l_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzuje5bfcdqW2eqNPmuxt7PKi8QL0nH4c8rmRyNNSpFV6sLPcYf9W1NUldcM-2BnbaG7JJ-2BYiSCweZmBW9AahX197ek1OVAjZBfAL57Ng9x55XlvPUgDGoD4TmuJbMlmDifEb-2BGyR2Q6eOCGhHYKbTHQnB9pcAH3hFOL4Dx7xCNpnmhx71Lgbn-2FmjXBZUjagbCSHw-3D-3D>
This is not a tax invoice. This is a payment receipt for the transportation
service provided by INREDUSE SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ.


UberX
17.04 kilometres | 20 min(s)
01:56
Testowa 1, 00-000 Warszawa, Poland
02:17
Przykładowa 1, 00-000 Warszawa, Poland

Report lost item ❯
<https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15Uvsoaok85PvqCQ3QlNb6arQAsUWbSTnikFU6vUxSTt8vgm7RDagOhr04y1Xv44afdKpcqaLlJ3iJEcDlphulsDM-3DJekm_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzut8JqtCH9UYigMcKT7iteCOX2LwAfbNwN10HzWhMyms8fG0KFv6B7cdNvPAOJyikrv3MyCNBHLhnpYSLJ3gilipjsZxpf2q1GfQR8CQqDEeO3mLCPIFZHFWkqaT4j-2F2EqDZKf-2F2OEQrqwcL10pVbytk5nkw1nT730qJmIqiQOJG4CUhz80hwVtx73g7FzOnSg-3D-3D>


Contact support❯
<https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15UjnU1u7fTMJxOJIS1zPN1gI-3D-QjG_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzmerI8F8IjqXzeR6jkYY2PvlL-2FSaL0CB3lAlRR4WfEno3uyXsX0ecaREB7h7EoxFJ1zFSKTXOiLjaLAyFZ5rc6w3x-2BeDE3OZIA20Sv1o2cOWVjHyTARjTZtEQNUgesXtoxtdUtueArQ3a21yXNy1nODG2LSNLU95BUyFhaWFKkPJ8C3v6dclDMHWxBQMK50lAQ-3D-3D>

My trips ❯
<https://email.uber.com/ls/click?upn=spA0-2FY-2B4siX2BcQou8-2F48-2FCuAvuoJdGqwWnZ4u-2BoGRshoZOO-2FR78Vytc-2FQoAWi93PfYS_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzovfEDe2FRLdoZ3zLs1-2ByIT7Xn59nRK-2FjH5cbyacxVtjbiHvpP3svQPcyRksN2wR6zRJRXfkoZdQ-2FZFDTHczEPApHKclC5WUOI8LWOUCdSLfpzZ9hrwSXQLTeBctRDwCeOjX39TM0KQTJNWSknA7jZBhfdSdNdXUs-2Fux4lLGUYVeVptEX-2FIfV6M-2Bq1bimXXoEA-3D-3D>



Forgotten password
<https://email.uber.com/ls/click?upn=5TQkI4cGxaIGltwScN15UiEU1Z05tLORYDhCMvHDxMXp1-2FGrvQPqpo9EFNFs3mqmwnK9G-2F3FherPjzsICj7yM-2FK-2FJYue6uKR2EHeIe26RLwpFTiSq-2BB-2FMOIwXA4MEf4KzHSrwM9QQbMHeXFgqFXItep-2Bp1Kf9guqlEKa1wFayRA3nSyhHdpw0M5nDUB4Sy-2FJsESM7ZfaBkdKepvt8RTcsw-3D-3DA5YV_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzr5Y6CjV1jhBuz3dixT4ULvOcxVqtSY-2BHKgHpjce-2Ftt5V2PiCX6ciK9uWvbWPNLRkN7GKLvi3RyBNIdEyRoagEZcZjnVrotEScVtGt8NMg97nAmtS7VCAssrNyusKQZBhSDCBo4vUBTgm3ClpOYbrwSSJQuDO4cpk4hX3be7PAakwy2OhF4CDEpED4UCcBGXeA-3D-3D>
Privacy
<https://email.uber.com/ls/click?upn=Ib78WjkFQ66GYzavQJcfTaUW2mLjCZlesuzr-2FyzEQzDKq5PxwjJLnlhd3kWpjkC8zbzr_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzrS16eFBPrSuvEjiLKVbX7A0RoTdHhJwdCk2AmIBKR3oBXtUAfGhrYz1-2Fioyot55xXe3Xs3BGZJlgkXG6Fg0nUEnzT8Mun6-2FlEb2b-2BigC0-2Bs0RIlpSnIKjGrWwBzImYi7fceKwLz-2B9muSKCMHoV30OXIQGgsCFZCB1ueoNrVKzUqgezacElaGj2FR4VrHnyqVQ-3D-3D>
Terms
<https://email.uber.com/ls/click?upn=Ib78WjkFQ66GYzavQJcfTaUW2mLjCZlesuzr-2FyzEQzD9L-2F1tKRCOuyZn2F4t4pFGWOJ8_tp8atahXK0T3tObjWh-2F8Rx5APr3HsKaUWQfHeXdstOFCjLJ63biVOZJnAuz1xZB9cIEfNWpyAImeTkoyVqsGsS9a3OkWc8xjGa7760HxTp-2BRixOTcQUKpnc6-2BGOSX7M4sclwmd1nGRJgn1NgpGGf2nPo91SFS6Zt2RJRgFSp7W01Wm4lWq10LIYOCjM2k9VSz6wpDljom5qhB9xDp9Wk85WHgVJKp7StZYqw2lMiCqikcTOVDRdqkXXqyU8skZVXUUBr7kb6rgErh6wk8jlotLbjsCd2YdLRq9Q7e1C47dTkQJASWO-2FYvUCB1siacVFPUNInFUpEPlqUPOJp-2BjoL689AfDkufwL1A6w-2FEnwIlaVN-2BlESvjP6nQgnj4jeEX1sLn0NVteI1lyvBetuxmrIIysavbTQ9sDnO0hMAHd8nRFOsvFR3L8MECIjwCyPaep7RCJTloR0rAere0FtH1-2BYzrr7Reuq34a24q4OH9MRBtB0E-2FZbM0laKOiHBEV2B-2BFXVNKs62P2Fm5Q9AEQezzRdyheBSL7McmH2xtP81bsal-2B9w3b-2BZaw14LHI0Yp2wzsf84Xu7sj4aFFRhVwQ7MFxbL-2F6dZM4CYZ1qhoCin-2BQX8NshnmCxdhYJkxF2OfZrzqDiahEP3WC5RtQu29wMEvX-2Bw-3D-3D>
Uber Poland sp. z o.o.
ul. Inflancka 4, 00-189 Warszawa

Fare does not include fees that may be charged by your bank. Please contact
your bank directly for inquiries.`;

    expect(() => uberParser(messageText)).toThrow();
  });
});
