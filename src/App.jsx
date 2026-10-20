import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Activity, ArrowDownToLine, ArrowRight, CircleDollarSign, Gift, RefreshCw, ShoppingBag, Sparkles, Users } from 'lucide-react';
import { fetchTransactions } from './services/transactionsApi';
import { enrichTransactions, sortTransactions, summarizeRewards } from './lib/rewards';
import StatCard from './components/StatCard';
import { MonthlyRewardsTable, TotalsTable, TransactionsTable } from './components/RewardsTables';

function LoadingState() {
  return <main className="state-screen" role="status"><span className="spinner" /><p>Loading your rewards…</p></main>;
}

function ErrorState({ message, onRetry }) {
  return <main className="state-screen error-screen" role="alert"><span className="error-mark">!</span><h1>We hit a snag</h1><p>{message}</p><button className="primary-button" onClick={onRetry}><RefreshCw size={16} /> Try again</button></main>;
}
ErrorState.propTypes = { message: PropTypes.string.isRequired, onRetry: PropTypes.func.isRequired };

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [activeNav, setActiveNav] = useState('Overview');

  async function loadTransactions() {
    setStatus('loading'); setError('');
    try { setTransactions(enrichTransactions(await fetchTransactions())); setStatus('success'); }
    catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'An unexpected error occurred.'); setStatus('error'); }
  }

  useEffect(() => { loadTransactions(); }, []);

  const summary = useMemo(() => summarizeRewards(transactions), [transactions]);
  const customers = useMemo(() => [...new Map(transactions.map(({ customerId, customerName }) => [customerId, { customerId, name: customerName }])).values()], [transactions]);
  const filteredTransactions = useMemo(() => sortTransactions(transactions.filter((transaction) => customerFilter === 'all' || transaction.customerId === customerFilter)), [transactions, customerFilter]);
  const transactionCount = transactions.length;
  const averageOrder = transactionCount ? transactions.reduce((sum, item) => sum + item.amount, 0) / transactionCount : 0;

  if (status === 'loading') return <LoadingState />;
  if (status === 'error') return <ErrorState message={error} onRetry={loadTransactions} />;

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#overview" aria-label="Perkly home"><span className="brand-mark"><Sparkles size={17} fill="currentColor" /></span><span>perkly<span className="brand-dot">.</span></span></a>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="main-nav" aria-label="Main navigation">{[{ label: 'Overview', icon: Activity }, { label: 'Customers', icon: Users }, { label: 'Transactions', icon: ShoppingBag }, { label: 'Rewards', icon: Gift }].map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${activeNav === label ? 'active' : ''}`} onClick={() => { setActiveNav(label); if (label === 'Transactions') document.getElementById('transactions')?.scrollIntoView({ behavior: 'smooth' }); else window.scrollTo({ top: 0, behavior: 'smooth' }); }}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{label === 'Transactions' && <span className="nav-count">{transactionCount}</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><span className="help-icon"><CircleDollarSign size={17} /></span><strong>Rewards made simple</strong><p>Turn every purchase into a reason to come back.</p><button onClick={() => setActiveNav('Rewards')}>Explore rewards <ArrowRight size={14} /></button></div><div className="profile"><span className="profile-avatar">JD</span><span className="profile-text"><strong>Jamie Dawson</strong><small>Store administrator</small></span><button className="profile-menu" aria-label="Profile menu">•••</button></div></div>
    </aside>

    <main className="main-content" id="overview">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>{activeNav}</strong></div><div className="topbar-right"><span className="sync-indicator"><i /> Live data</span><span className="topbar-divider" /><button className="download-button" onClick={() => window.print()}><ArrowDownToLine size={15} /> Export report</button><span className="topbar-avatar">JD</span></div></header>
      <div className="page-content">
        <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line" /> CUSTOMER LOYALTY</div><h1>Rewards overview<span className="title-period">.</span></h1><p className="page-description">A little appreciation goes a long way. Here’s how your customers are earning.</p></div><div className="date-range"><span className="date-range-icon"><Activity size={17} /></span><span><small>REPORTING PERIOD</small><strong>Dec 2023 — Feb 2024</strong></span></div></section>

        <section className="stats-grid" aria-label="Rewards summary"><StatCard label="Points awarded" value={summary.totalPoints.toLocaleString()} detail="Across all customers" icon={Sparkles} /><StatCard label="Purchases tracked" value={String(transactionCount)} detail="Across 3 months" icon={ShoppingBag} tone="blue" /><StatCard label="Active customers" value={String(customers.length)} detail="In this period" icon={Users} tone="purple" /><StatCard label="Average order" value={`$${averageOrder.toFixed(2)}`} detail="Per transaction" icon={CircleDollarSign} tone="amber" /></section>

        <section className="highlight-banner"><span className="highlight-icon"><Sparkles size={18} /></span><p><strong>Good things add up.</strong> Your customers earned <strong>{summary.totalPoints} points</strong> across <strong>{transactionCount} purchases</strong> this quarter.</p><a href="#monthly">See the breakdown <ArrowRight size={14} /></a></section>

        <div className="primary-grid" id="monthly"><MonthlyRewardsTable rows={summary.monthly} /><TotalsTable rows={summary.totals} /></div>
        <div id="transactions"><TransactionsTable rows={filteredTransactions} customerId={customerFilter} onCustomerChange={setCustomerFilter} customers={customers} /></div>
        <footer className="page-footer"><span>Showing {transactionCount} transactions · Dates shown consistently</span><span>Points calculated per transaction <span className="footer-dot">·</span> Updated just now</span></footer>
      </div>
    </main>
  </div>;
}
