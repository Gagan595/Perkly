import PropTypes from 'prop-types';
import { ArrowUpRight } from 'lucide-react';

export default function StatCard({ label, value, detail, icon: Icon, tone = 'green' }) {
  return (
    <article className="stat-card">
      <div className="stat-top"><span className={`stat-icon ${tone}`}><Icon size={19} strokeWidth={1.8} /></span><span className="stat-period">Last 3 months</span></div>
      <p className="stat-label">{label}</p>
      <div className="stat-value-row"><strong>{value}</strong><span className="stat-trend"><ArrowUpRight size={14} /> {detail}</span></div>
    </article>
  );
}

StatCard.propTypes = { label: PropTypes.string.isRequired, value: PropTypes.string.isRequired, detail: PropTypes.string.isRequired, icon: PropTypes.elementType.isRequired, tone: PropTypes.string };
