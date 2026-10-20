import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { fetchTransactions } from './services/transactionsApi';

jest.mock('./services/transactionsApi', () => ({ fetchTransactions: jest.fn() }));

const transactions = [
  { id: 'TX-1', customerId: 'CUS-1', customerName: 'Alex Green', date: '2024-01-10T10:00:00', product: 'Coffee set', amount: 120 },
  { id: 'TX-2', customerId: 'CUS-2', customerName: 'Sam Blue', date: '2024-02-10T10:00:00', product: 'Tea pot', amount: 75 },
];

beforeEach(() => { fetchTransactions.mockResolvedValue(transactions); });

test('shows loading, then renders reward summaries and transaction details', async () => {
  render(<App />);
  expect(screen.getByRole('status')).toHaveTextContent('Loading your rewards');
  expect(await screen.findByRole('heading', { name: /Rewards overview/ })).toBeInTheDocument();
  expect(screen.getByText('115')).toBeInTheDocument();
  expect(screen.getByText('Coffee set')).toBeInTheDocument();
  expect(screen.getByText('Tea pot')).toBeInTheDocument();
});

test('filters transactions by customer', async () => {
  const user = userEvent.setup();
  render(<App />);
  await screen.findByRole('heading', { name: /Rewards overview/ });
  await user.selectOptions(screen.getByLabelText('Filter by customer'), 'CUS-1');
  expect(screen.getByText('Coffee set')).toBeInTheDocument();
  expect(screen.queryByText('Tea pot')).not.toBeInTheDocument();
});

test('shows a recoverable error state when the API fails', async () => {
  fetchTransactions.mockRejectedValueOnce(new Error('Service unavailable'));
  render(<App />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Service unavailable');
  await waitFor(() => expect(screen.getByRole('button', { name: /Try again/ })).toBeEnabled());
});
