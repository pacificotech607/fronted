import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
  color: 'primary' | 'info' | 'success' | 'warning' | 'danger';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  color
}) => {
  const getColorClass = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary';
      case 'info': return 'bg-info';
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'danger': return 'bg-danger';
      default: return 'bg-primary';
    }
  };

  const getChangeColorClass = (type: string) => {
    return type === 'positive' ? 'text-success' : 'text-danger';
  };

  const getChangeIcon = (type: string) => {
    return type === 'positive' ? 'bi-arrow-up' : 'bi-arrow-down';
  };

  return (
    <div className="card metric-card h-100">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col">
            <div className="text-muted text-uppercase small fw-bold">{title}</div>
            <div className="h2 fw-bold mb-0">{value}</div>
            <div className={`small ${getChangeColorClass(changeType)} d-flex align-items-center`}>
              <i className={`bi ${getChangeIcon(changeType)} me-1`}></i>
              {change}
            </div>
          </div>
          <div className="col-auto">
            <div className={`icon-shape ${getColorClass(color)} text-white rounded-circle d-flex align-items-center justify-content-center`}>
              <i className={`bi ${icon} fs-4`}></i>
            </div>
          </div>
        </div>
      </div>
      <div className="metric-chart">
        {/* Placeholder for mini trend line */}
        <svg width="100%" height="40" className="mt-2">
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" className={`stop-color-${color}`} stopOpacity="0.3" />
              <stop offset="100%" className={`stop-color-${color}`} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,30 Q25,10 50,20 T100,15 L100,40 L0,40 Z"
            fill={`url(#gradient-${color})`}
            className={`stroke-${color}`}
            strokeWidth="2"
          />
          <path
            d="M0,30 Q25,10 50,20 T100,15"
            fill="none"
            className={`stroke-${color}`}
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
};

export default MetricCard;