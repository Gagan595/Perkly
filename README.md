# Perkly Customer Rewards Dashboard

Perkly is a React dashboard for reviewing customer loyalty points across a three-month reporting period. It calculates points per purchase, groups them by customer and calendar month, ranks customer totals, and lists the underlying transactions. The sample period crosses December 2023 into January and February 2024 so month and year aggregation are both exercised.

## Run locally

Requires Node.js 18 or newer and npm.

```bash
npm install
npm run dev
```

Vite prints the local URL. To create a production build, run `npm run build`.

## Reward calculation

Points are calculated for each transaction, then summed. A customer earns 1 point for each whole dollar from $50 through $100, and 2 points for each whole dollar above $100. Amounts below $50 earn no points. Fractional dollars are ignored, so $100.40 earns 50 points and $120.99 earns 90 points. The calculation uses the floor of the purchase amount and does not round fractions into another point.

The pure functions in `src/lib/rewards.js` calculate points, derive a year-aware month key, enrich transaction records, sort purchases by date, and produce monthly and customer totals. They do not mutate their input arrays. Monthly aggregation uses both year and month, so December 2023 and January 2024 remain separate periods.

## Dashboard behavior

- A Promise-based mock API in `src/services/transactionsApi.js` simulates an asynchronous data request using the sample dataset in `src/data/transactions.js`.
- The dashboard renders loading, success, and recoverable error states. The loading state follows the API promise; no fixed timer is used.
- Summary cards show awarded points, purchase count, active customers, and average order amount.
- The monthly rewards table includes customer ID, customer name, month, year, and earned points.
- The customer totals table ranks total earned points.
- The recent transactions table shows transaction ID, customer, product, purchase date, amount, and points. Its customer selector filters transactions.
- Tables are sorted during render/calculation rather than storing sort state. Transactions sort newest first; monthly results sort by year and month descending.
- React is used with JavaScript (no TypeScript or Redux). Components validate their props with PropTypes.
- Layout adapts to narrow screens and includes keyboard focus styles and semantic table headings.

## Project structure

```text
src/
  components/
    RewardsTables.jsx       Monthly, totals, and transaction tables
    StatCard.jsx            Reusable summary card
  data/
    transactions.js         Demonstration transactions
  lib/
    rewards.js              Pure calculation and aggregation functions
    rewards.test.js         Calculation and year-boundary unit tests
  services/
    transactionsApi.js      Promise-based mock API
  test/
    setup.js                Jest DOM setup
    styleMock.js            CSS module mock for Jest
  App.jsx                   Dashboard and loading/error states
  App.test.jsx              Loading, dashboard, filtering, and error tests
  main.jsx                  React entry point
  styles.css                Responsive dashboard styling
```

## Tests and lint

```bash
npm test
npm run lint
```

Jest covers reward thresholds, fractional purchases, invalid/negative amounts, the year boundary, aggregation, ordering, dashboard loading and rendering, transaction filtering, and API failure handling.

## Screenshots

The scenarios to capture from the running app are:

1. **Dashboard:** the default view with all four summary cards, monthly rewards, customer totals, and recent transactions.
2. **Filtered transactions:** choose a customer in the transaction selector to show only that customer's purchases.
3. **Loading:** visible briefly while the asynchronous API promise is pending.
4. **Error and recovery:** the error message and **Try again** action when the API rejects, followed by the dashboard when a retry succeeds.

The error state is exercised in `src/App.test.jsx` by rejecting the mocked API request. Replace the in-memory API with a real endpoint by updating `fetchTransactions`; no dashboard calculation code depends on the sample records.

## GitHub

The current checkout has no Git remote configured. After creating or selecting the intended GitHub repository, add its URL and push the branch:

```bash
git remote add origin <repository-url>
git add .
git commit -m "Build customer rewards dashboard"
git push -u origin main
```
