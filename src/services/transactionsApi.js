import { sampleTransactions } from '../data/transactions';

// Promise-based mock API mirrors an asynchronous network response without a fixed timer.
export async function fetchTransactions() {
  const response = await Promise.resolve({ ok: true, data: sampleTransactions });
  if (!response.ok || !Array.isArray(response.data)) throw new Error('We could not load your transactions. Please try again.');
  return response.data;
}
