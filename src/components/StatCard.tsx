
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon,
  className
}) => {
  return (
    <div className={cn("stat-card", className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-muted-foreground/70">{icon}</div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {change !== undefined && (
        <div className="flex items-center text-sm">
          {change >= 0 ? (
            <div className="flex items-center text-brand-green">
              <ArrowUpIcon size={14} className="mr-1" />
              <span>{Math.abs(change)}%</span>
            </div>
          ) : (
            <div className="flex items-center text-destructive">
              <ArrowDownIcon size={14} className="mr-1" />
              <span>{Math.abs(change)}%</span>
            </div>
          )}
          <span className="ml-1 text-muted-foreground">vs last period</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
