import PropTypes from 'prop-types';
import { ArrowDown, ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { formatCurrency, formatDate, formatMonthYear } from '../lib/rewards';

function SectionHeading({ title, description, count, action }) {
  return <div className="section-heading"><div><h2>{title}</h2><p>{description}</p></div><div className="section-tools"><span className="row-count">{count} records</span>{action}</div></div>;
}
SectionHeading.propTypes = { title: PropTypes.string.isRequired, description: PropTypes.string.isRequired, count: PropTypes.number.isRequired, action: PropTypes.node };

export function MonthlyRewardsTable({ rows }) {
  return <section className="panel monthly-panel"><SectionHeading title="Monthly rewards" description="Points earned by each customer" count={rows.length} />
    <div className="table-wrap"><table><thead><tr><th>Customer <ArrowUpDown size={13} /></th><th>Customer ID</th><th>Month</th><th className="align-right">Reward points <ArrowDown size={13} /></th></tr></thead>
      <tbody>{rows.map((row) => <tr key={`${row.customerId}-${row.monthKey}`}><td><div className="customer-cell"><span className={`avatar avatar-${row.customerId.slice(-1)}`}>{row.name.split(' ').map((part) => part[0]).join('')}</span><span className="customer-name">{row.name}</span></div></td><td><span className="id-label">{row.customerId}</span></td><td><span className="month-pill">{formatMonthYear(row.monthKey)}</span></td><td className="align-right"><strong className="points-value">{row.points}</strong><span className="points-unit"> pts</span></td></tr>)}</tbody>
    </table></div>
  </section>;
}
MonthlyRewardsTable.propTypes = { rows: PropTypes.arrayOf(PropTypes.shape({ customerId: PropTypes.string.isRequired, name: PropTypes.string.isRequired, monthKey: PropTypes.string.isRequired, points: PropTypes.number.isRequired })).isRequired };

export function TotalsTable({ rows }) {
  return <section className="panel totals-panel"><SectionHeading title="Top customers" description="Total rewards earned" count={rows.length} />
    <div className="table-wrap"><table><thead><tr><th>Customer</th><th className="align-right">Total points</th><th aria-label="Actions" /></tr></thead><tbody>
      {rows.map((row, index) => <tr key={row.customerId}><td><div className="customer-cell"><span className={`rank rank-${index + 1}`}>{String(index + 1).padStart(2, '0')}</span><span className={`avatar avatar-${row.customerId.slice(-1)}`}>{row.name.split(' ').map((part) => part[0]).join('')}</span><span className="customer-name">{row.name}</span></div></td><td className="align-right"><strong className="points-value">{row.points}</strong><span className="points-unit"> pts</span></td><td className="action-cell"><button className="icon-button" aria-label={`More options for ${row.name}`}><MoreHorizontal size={17} /></button></td></tr>)}
    </tbody></table></div>
  </section>;
}
TotalsTable.propTypes = { rows: PropTypes.arrayOf(PropTypes.shape({ customerId: PropTypes.string.isRequired, name: PropTypes.string.isRequired, points: PropTypes.number.isRequired })).isRequired };

export function TransactionsTable({ rows, customerId, onCustomerChange, customers }) {
  return <section className="panel transactions-panel"><SectionHeading title="Recent transactions" description="Every purchase, with points earned" count={rows.length}
    action={<label className="select-wrap"><span className="sr-only">Filter by customer</span><select aria-label="Filter by customer" value={customerId} onChange={(event) => onCustomerChange(event.target.value)}><option value="all">All customers</option>{customers.map((customer) => <option key={customer.customerId} value={customer.customerId}>{customer.name}</option>)}</select></label>} />
    <div className="table-wrap"><table><thead><tr><th>Transaction</th><th>Customer</th><th>Product</th><th>Purchase date</th><th className="align-right">Amount</th><th className="align-right">Points</th></tr></thead><tbody>
      {rows.map((row) => <tr key={row.id}><td><span className="id-label">{row.id}</span></td><td><span className="customer-name">{row.customerName}</span></td><td>{row.product}</td><td>{formatDate(row.date)}</td><td className="align-right">{formatCurrency(row.amount)}</td><td className="align-right"><span className="points-badge">+{row.points}</span></td></tr>)}
      {rows.length === 0 && <tr><td colSpan="6" className="empty-cell">No transactions match this customer.</td></tr>}
    </tbody></table></div>
  </section>;
}
TransactionsTable.propTypes = { rows: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired, customerName: PropTypes.string.isRequired, product: PropTypes.string.isRequired, date: PropTypes.string.isRequired, amount: PropTypes.number.isRequired, points: PropTypes.number.isRequired })).isRequired, customerId: PropTypes.string.isRequired, onCustomerChange: PropTypes.func.isRequired, customers: PropTypes.arrayOf(PropTypes.shape({ customerId: PropTypes.string.isRequired, name: PropTypes.string.isRequired })).isRequired };
