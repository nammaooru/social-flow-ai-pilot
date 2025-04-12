
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface SocialAccountCardProps {
  platform: string;
  icon: React.ReactNode;
  isConnected: boolean;
  status?: 'good' | 'warning' | 'error';
  className?: string;
  accountName?: string;
}

const SocialAccountCard: React.FC<SocialAccountCardProps> = ({
  platform,
  icon,
  isConnected,
  status = 'good',
  className,
  accountName
}) => {
  return (
    <div className={cn(
      "flex items-center justify-between p-4 border border-border rounded-lg",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <h3 className="font-medium">{platform}</h3>
          {isConnected && accountName && (
            <p className="text-sm text-muted-foreground">{accountName}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {isConnected ? (
          <>
            <div className="flex items-center mr-2">
              {status === 'good' && (
                <CheckCircle size={16} className="text-brand-green mr-1" />
              )}
              {status === 'warning' && (
                <AlertCircle size={16} className="text-amber-500 mr-1" />
              )}
              {status === 'error' && (
                <AlertCircle size={16} className="text-destructive mr-1" />
              )}
              <span className="text-sm">
                {status === 'good' && 'Connected'}
                {status === 'warning' && 'Limited access'}
                {status === 'error' && 'Error'}
              </span>
            </div>
            <Button variant="outline" size="sm">Manage</Button>
          </>
        ) : (
          <Button variant="default" size="sm">Connect</Button>
        )}
      </div>
    </div>
  );
};

export default SocialAccountCard;
