import * as ynab from "ynab";

const ynabAPI = new ynab.API(process.env["YNAB_ACCESS_TOKEN"] ?? "");
const budgetName = process.env["YNAB_BUDGET_NAME"];
const accountName = process.env["YNAB_ACCOUNT_NAME"];

const saveTransaction = async (
  transaction: Omit<ynab.SaveTransaction, "account_id">
) => {
  const { data: budgetsData } = await ynabAPI.budgets.getBudgets();
  const budgetId = budgetsData.budgets.find(
    ({ name }) => name === budgetName
  )?.id;

  if (!budgetId) {
    throw new Error(
      `Error: invalid budget id '${budgetId}' for budget name '${budgetName}'`
    );
  }

  const { data: budgetData } = await ynabAPI.budgets.getBudgetById(budgetId);
  const accountId = budgetData.budget.accounts?.find(
    ({ name }) => name === accountName
  )?.id;

  if (!accountId) {
    throw new Error(
      `Error: invalid account id '${accountId}' for account name '${accountName}'`
    );
  }

  await ynabAPI.transactions.createTransaction(budgetId, {
    transaction: { ...transaction, account_id: accountId },
  });
};

export const ynabService = {
  saveTransaction,
};
