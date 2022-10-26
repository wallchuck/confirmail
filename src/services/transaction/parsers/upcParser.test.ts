import parseISO from "date-fns/parseISO";

import { TransactionDetails } from "../transaction.types";
import { upcParser } from "./upcParser";

describe("upcParser", () => {
  it("reads transaction details from message text", async () => {
    const messageText = `
---------- Forwarded message ---------
From: BM <no-reply@bm.pl>
Date: Wed, 12 Oct 2022 at 10:20
Subject: Płatność automatyczna dla UPC Polska Sp. z o.o. została
zrealizowana
To: <example@example.com>




Data transakcji: 2022-10-12 10:20:25

Nr transakcji: ABC123456789



Potwierdzenie wysłania przelewu automatycznego


Odbiorca płatności:
UPC Polska Sp. z o.o.

*Numer konta:*

00000000000000000000000000

*Tytuł przelewu:*

Opłata miesięczna

*Kwota:*
59.99 PLN

Prowizja:
1.00 PLN

Łączna kwota:
60.99 PLN

Identyfikator zamówienia
ABC123456789







Informujemy, że czas zaksięgowania przelewu na rachunku bankowym odbiorcy
jest uzależniony od działania wewnętrznego systemu bankowości
elektronicznej w banku odbiorcy. Dokładamy wszelkich starań, aby przelewy
były realizowane w możliwie najkrótszym czasie.

Pozdrawiamy,
Zespół Blue Media

Centrum Pomocy
Blue Media

od poniedziałku do piątku od 7:00 do 22:00, w soboty od 8:00 do 16:00
58 7604 844
<587604844> - połączenie płatne zgodnie z taryfą operatora. Całodobowo
zapraszamy też do kontaktu poprzez formularz online
<https://pomoc.bluemedia.pl>.

Wiadomość wysłana na podstawie art. 24 Ustawy z dnia 19 sierpnia 2011 r. o
usługach płatniczych z późn. zm. przez Blue Media S.A. z siedzibą w
Sopocie, ul. Powstańców Warszawy 6, 81-718 Sopot, zarejestrowaną w Sądzie
Rejonowym Gdańsk-Północ, VIII Wydział Gospodarczy KRS pod nr 0000320590,
NIP 585-13-51-185, REGON 191781561, kapitał zakładowy 2 205 500 PLN
(wpłacony w całości), nadzorowaną przez Komisję Nadzoru Finansowego i
wpisaną do rejestru krajowych instytucji płatniczych pod numerem IP17/2013.
Administratorem danych osobowych niezbędnych w procesie płatności jest Blue
Media S.A. ul. Powstańców Warszawy 6, 81-718 Sopot. Dane osobowe
przetwarzane są w celu realizacji płatności oraz wypełnienia obowiązków
wynikających z przepisów prawa (ustawy z dnia 19.08.2011r. o usługach
płatniczych, ustawy z dnia 16.11.2000 r. o przeciwdziałaniu praniu
pieniędzy i finansowaniu terroryzmu). Niektóre dane zostały udostępnione
przez odbiorcę płatności i w odniesieniu do tych danych płatnik ma prawo
sprzeciwu co do ich przetwarzania. Podanie danych osobowych jest
dobrowolne, ale niezbędne do realizacji płatności. Płatnikowi przysługuje
prawo dostępu do treści przetwarzanych danych osobowych oraz prawo ich
poprawiania.
Jeśli nie jest Pani/Pan zamierzonym adresatem niniejszej wiadomości,
prosimy o poinformowanie nas o tym oraz usunięcie wiadomości bez otwierania
załączników.`;

    const transactionDetails: TransactionDetails = {
      date: parseISO("2022-10-12"),
      amount: 60.99,
      memo: undefined,
    };

    expect(upcParser(messageText)).toStrictEqual(transactionDetails);
  });

  it("throws if date string cannot be parsed", async () => {
    const messageText = `
---------- Forwarded message ---------
From: BM <no-reply@bm.pl>
Date: Wed, 12 Oct 2022 at 10:20
Subject: Płatność automatyczna dla UPC Polska Sp. z o.o. została
zrealizowana
To: <example@example.com>




Data transakcji: 2022/10/12 10:20:25

Nr transakcji: ABC123456789



Potwierdzenie wysłania przelewu automatycznego


Odbiorca płatności:
UPC Polska Sp. z o.o.

*Numer konta:*

00000000000000000000000000

*Tytuł przelewu:*

Opłata miesięczna

*Kwota:*
59.99 PLN

Prowizja:
1.00 PLN

Łączna kwota:
60.99 PLN

Identyfikator zamówienia
ABC123456789







Informujemy, że czas zaksięgowania przelewu na rachunku bankowym odbiorcy
jest uzależniony od działania wewnętrznego systemu bankowości
elektronicznej w banku odbiorcy. Dokładamy wszelkich starań, aby przelewy
były realizowane w możliwie najkrótszym czasie.

Pozdrawiamy,
Zespół Blue Media

Centrum Pomocy
Blue Media

od poniedziałku do piątku od 7:00 do 22:00, w soboty od 8:00 do 16:00
58 7604 844
<587604844> - połączenie płatne zgodnie z taryfą operatora. Całodobowo
zapraszamy też do kontaktu poprzez formularz online
<https://pomoc.bluemedia.pl>.

Wiadomość wysłana na podstawie art. 24 Ustawy z dnia 19 sierpnia 2011 r. o
usługach płatniczych z późn. zm. przez Blue Media S.A. z siedzibą w
Sopocie, ul. Powstańców Warszawy 6, 81-718 Sopot, zarejestrowaną w Sądzie
Rejonowym Gdańsk-Północ, VIII Wydział Gospodarczy KRS pod nr 0000320590,
NIP 585-13-51-185, REGON 191781561, kapitał zakładowy 2 205 500 PLN
(wpłacony w całości), nadzorowaną przez Komisję Nadzoru Finansowego i
wpisaną do rejestru krajowych instytucji płatniczych pod numerem IP17/2013.
Administratorem danych osobowych niezbędnych w procesie płatności jest Blue
Media S.A. ul. Powstańców Warszawy 6, 81-718 Sopot. Dane osobowe
przetwarzane są w celu realizacji płatności oraz wypełnienia obowiązków
wynikających z przepisów prawa (ustawy z dnia 19.08.2011r. o usługach
płatniczych, ustawy z dnia 16.11.2000 r. o przeciwdziałaniu praniu
pieniędzy i finansowaniu terroryzmu). Niektóre dane zostały udostępnione
przez odbiorcę płatności i w odniesieniu do tych danych płatnik ma prawo
sprzeciwu co do ich przetwarzania. Podanie danych osobowych jest
dobrowolne, ale niezbędne do realizacji płatności. Płatnikowi przysługuje
prawo dostępu do treści przetwarzanych danych osobowych oraz prawo ich
poprawiania.
Jeśli nie jest Pani/Pan zamierzonym adresatem niniejszej wiadomości,
prosimy o poinformowanie nas o tym oraz usunięcie wiadomości bez otwierania
załączników.`;

    expect(() => upcParser(messageText)).toThrow();
  });

  it("throws if amount string cannot be parsed", async () => {
    const messageText = `
---------- Forwarded message ---------
From: BM <no-reply@bm.pl>
Date: Wed, 12 Oct 2022 at 10:20
Subject: Płatność automatyczna dla UPC Polska Sp. z o.o. została
zrealizowana
To: <example@example.com>




Data transakcji: 2022-10-12 10:20:25

Nr transakcji: ABC123456789



Potwierdzenie wysłania przelewu automatycznego


Odbiorca płatności:
UPC Polska Sp. z o.o.

*Numer konta:*

00000000000000000000000000

*Tytuł przelewu:*

Opłata miesięczna

*Kwota:*
59.99 PLN

Prowizja:
1.00 PLN

Łączna kwota:
60,99 PLN

Identyfikator zamówienia
ABC123456789







Informujemy, że czas zaksięgowania przelewu na rachunku bankowym odbiorcy
jest uzależniony od działania wewnętrznego systemu bankowości
elektronicznej w banku odbiorcy. Dokładamy wszelkich starań, aby przelewy
były realizowane w możliwie najkrótszym czasie.

Pozdrawiamy,
Zespół Blue Media

Centrum Pomocy
Blue Media

od poniedziałku do piątku od 7:00 do 22:00, w soboty od 8:00 do 16:00
58 7604 844
<587604844> - połączenie płatne zgodnie z taryfą operatora. Całodobowo
zapraszamy też do kontaktu poprzez formularz online
<https://pomoc.bluemedia.pl>.

Wiadomość wysłana na podstawie art. 24 Ustawy z dnia 19 sierpnia 2011 r. o
usługach płatniczych z późn. zm. przez Blue Media S.A. z siedzibą w
Sopocie, ul. Powstańców Warszawy 6, 81-718 Sopot, zarejestrowaną w Sądzie
Rejonowym Gdańsk-Północ, VIII Wydział Gospodarczy KRS pod nr 0000320590,
NIP 585-13-51-185, REGON 191781561, kapitał zakładowy 2 205 500 PLN
(wpłacony w całości), nadzorowaną przez Komisję Nadzoru Finansowego i
wpisaną do rejestru krajowych instytucji płatniczych pod numerem IP17/2013.
Administratorem danych osobowych niezbędnych w procesie płatności jest Blue
Media S.A. ul. Powstańców Warszawy 6, 81-718 Sopot. Dane osobowe
przetwarzane są w celu realizacji płatności oraz wypełnienia obowiązków
wynikających z przepisów prawa (ustawy z dnia 19.08.2011r. o usługach
płatniczych, ustawy z dnia 16.11.2000 r. o przeciwdziałaniu praniu
pieniędzy i finansowaniu terroryzmu). Niektóre dane zostały udostępnione
przez odbiorcę płatności i w odniesieniu do tych danych płatnik ma prawo
sprzeciwu co do ich przetwarzania. Podanie danych osobowych jest
dobrowolne, ale niezbędne do realizacji płatności. Płatnikowi przysługuje
prawo dostępu do treści przetwarzanych danych osobowych oraz prawo ich
poprawiania.
Jeśli nie jest Pani/Pan zamierzonym adresatem niniejszej wiadomości,
prosimy o poinformowanie nas o tym oraz usunięcie wiadomości bez otwierania
załączników.`;

    expect(() => upcParser(messageText)).toThrow();
  });
});
