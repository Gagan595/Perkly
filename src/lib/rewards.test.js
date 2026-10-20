import { calculateRewardPoints, enrichTransactions, getMonthKey, sortTransactions, summarizeRewards } from './rewards';

describe('calculateRewardPoints', () => {
  test.each([[0, 0], [49.99, 0], [50, 0], [75, 25], [100, 50], [100.2, 50], [100.4, 50], [120, 90], [120.99, 90], [156.75, 162], [-4, 0], [Number.NaN, 0]])('awards %s dollars as %s points', (amount, expected) => {
    expect(calculateRewardPoints(amount)).toBe(expected);
  });
});

test('month keys distinguish years at the December to January boundary', () => {
  expect(getMonthKey('2023-12-29T12:00:00')).toBe('2023-12');
  expect(getMonthKey('2024-01-01T12:00:00')).toBe('2024-01');
});

test('enrichment and aggregation group by customer and month and sort newest first', () => {
  const rows = enrichTransactions([
    { id: 'a', customerId: 'c1', customerName: 'Alex', date: '2023-12-03', amount: 120 },
    { id: 'b', customerId: 'c1', customerName: 'Alex', date: '2024-01-04', amount: 100.4 },
    { id: 'c', customerId: 'c2', customerName: 'Sam', date: '2024-01-08', amount: 75 },
  ]);
  const summary = summarizeRewards(rows);
  expect(summary.monthly.map(({ monthKey, points }) => [monthKey, points])).toEqual([['2024-01', 50], ['2024-01', 25], ['2023-12', 90]]);
  expect(summary.totals).toEqual([{ customerId: 'c1', name: 'Alex', points: 140 }, { customerId: 'c2', name: 'Sam', points: 25 }]);
  expect(summary.totalPoints).toBe(165);
  expect(sortTransactions(rows).map(({ id }) => id)).toEqual(['c', 'b', 'a']);
});
