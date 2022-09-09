const payees = ["Bolt Food"] as const;
export type Payee = typeof payees[number];
export const isPayee = (value: unknown): value is Payee =>
  Boolean(payees.find((payee) => payee === value));

export type TransactionDetails = {
  date: Date;
  amount: number;
  memo: string | undefined;
};

export type Transaction = TransactionDetails & {
  payee: Payee;
};

export type MessageTextParser = (messageText: string) => TransactionDetails;
