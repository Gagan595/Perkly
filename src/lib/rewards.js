const MONTH_FORMAT = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' });
const DATE_FORMAT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

// Reward points accrue on whole dollars only, as specified by the assignment.
export function calculateRewardPoints(amount) {
  if (!Number.isFinite(amount) || amount < 0) return 0;
  const wholeDollars = Math.floor(amount);
  const lowerTier = Math.max(0, Math.min(wholeDollars, 100) - 50);
  const upperTier = Math.max(0, wholeDollars - 100) * 2;
  return lowerTier + upperTier;
}

export function getMonthKey(date) {
  const parsed = new Date(date);
  return `${parsed.getUTCFullYear()}-${String(parsed.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function formatMonthYear(key) {
  const [year, month] = key.split('-').map(Number);
  return `${MONTH_FORMAT.format(new Date(Date.UTC(year, month - 1, 1)))} ${year}`;
}

export function formatDate(date) {
  return DATE_FORMAT.format(new Date(date));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function enrichTransactions(transactions) {
  return transactions.map((transaction) => ({ ...transaction, points: calculateRewardPoints(transaction.amount), monthKey: getMonthKey(transaction.date) }));
}

export function sortTransactions(transactions) {
  return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date) || a.id.localeCompare(b.id));
}

export function summarizeRewards(transactions) {
  const monthlyByCustomer = transactions.reduce((groups, transaction) => {
    const key = `${transaction.customerId}|${transaction.customerName}|${transaction.monthKey}`;
    groups[key] = (groups[key] || 0) + transaction.points;
    return groups;
  }, {});
  const totalsByCustomer = transactions.reduce((groups, transaction) => {
    groups[transaction.customerId] = { customerId: transaction.customerId, name: transaction.customerName, points: (groups[transaction.customerId]?.points || 0) + transaction.points };
    return groups;
  }, {});
  const monthly = Object.entries(monthlyByCustomer).map(([key, points]) => {
    const [customerId, name, monthKey] = key.split('|');
    const [year, month] = monthKey.split('-');
    return { customerId, name, monthKey, month: formatMonthYear(monthKey).split(' ')[0], year: Number(year), monthNumber: Number(month), points };
  });
  return {
    monthly: monthly.sort((a, b) => b.year - a.year || b.monthNumber - a.monthNumber || a.name.localeCompare(b.name)),
    totals: Object.values(totalsByCustomer).sort((a, b) => b.points - a.points || a.name.localeCompare(b.name)),
    totalPoints: transactions.reduce((total, transaction) => total + transaction.points, 0),
  };
}
