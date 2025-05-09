import React from 'react';
import Card from '../ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string | number;
    isPositive: boolean;
  };
  description?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  description,
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-semibold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
        
        {(change || description) && (
          <div className="mt-4">
            {change && (
              <div className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium ${
                change.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {change.isPositive ? '↑' : '↓'} {change.value}
              </div>
            )}
            {description && (
              <p className="mt-2 text-sm text-gray-500">{description}</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;