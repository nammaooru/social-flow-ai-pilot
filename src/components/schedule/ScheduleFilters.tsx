
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Filter, Check, RefreshCcw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ScheduleFiltersProps {
  filters: {
    platforms: string[];
    contentTypes: string[];
    campaigns: string[];
  };
  onApplyFilters: (filters: ScheduleFiltersProps['filters']) => void;
  onClose: () => void;
}

const platforms = ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube', 'Pinterest', 'all'];
const contentTypes = ['image', 'video', 'carousel', 'text', 'all'];
const campaigns = ['Summer Sale', 'Product Launch', 'Brand Awareness', 'all'];

const ScheduleFilters: React.FC<ScheduleFiltersProps> = ({ 
  filters, 
  onApplyFilters,
  onClose
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (
    category: 'platforms' | 'contentTypes' | 'campaigns',
    value: string
  ) => {
    if (value === 'all') {
      setLocalFilters({
        ...localFilters,
        [category]: ['all']
      });
      return;
    }

    let updatedValues = localFilters[category].includes(value)
      ? localFilters[category].filter(v => v !== value && v !== 'all')
      : [...localFilters[category].filter(v => v !== 'all'), value];

    if (updatedValues.length === 0) {
      updatedValues = ['all'];
    }

    setLocalFilters({
      ...localFilters,
      [category]: updatedValues
    });
  };

  const resetFilters = () => {
    setLocalFilters({
      platforms: ['all'],
      contentTypes: ['all'],
      campaigns: ['all']
    });
  };

  const applyFilters = () => {
    onApplyFilters(localFilters);
  };

  const renderFilterBadges = (
    category: 'platforms' | 'contentTypes' | 'campaigns',
    values: string[],
    options: string[]
  ) => {
    if (values.includes('all')) {
      return (
        <Badge variant="outline" className="bg-muted">
          All
        </Badge>
      );
    }

    return values.map(value => (
      <Badge key={value} variant="secondary" className="flex items-center gap-1">
        {value}
        <button 
          onClick={() => handleFilterChange(category, value)}
          className="ml-1 rounded-full hover:bg-accent p-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      </Badge>
    ));
  };

  const isFiltered = !localFilters.platforms.includes('all') ||
                     !localFilters.contentTypes.includes('all') ||
                     !localFilters.campaigns.includes('all');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center">
          <Filter className="mr-2 h-5 w-5" />
          Filter Posts
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Platforms</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Select
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Platforms</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={localFilters.platforms.includes('all')}
                  onCheckedChange={() => handleFilterChange('platforms', 'all')}
                >
                  All Platforms
                </DropdownMenuCheckboxItem>
                {platforms.filter(p => p !== 'all').map(platform => (
                  <DropdownMenuCheckboxItem
                    key={platform}
                    checked={localFilters.platforms.includes(platform)}
                    onCheckedChange={() => handleFilterChange('platforms', platform)}
                  >
                    {platform}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap gap-2">
            {renderFilterBadges('platforms', localFilters.platforms, platforms)}
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Content Types</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Select
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Content Types</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={localFilters.contentTypes.includes('all')}
                  onCheckedChange={() => handleFilterChange('contentTypes', 'all')}
                >
                  All Types
                </DropdownMenuCheckboxItem>
                {contentTypes.filter(t => t !== 'all').map(type => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={localFilters.contentTypes.includes(type)}
                    onCheckedChange={() => handleFilterChange('contentTypes', type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap gap-2">
            {renderFilterBadges('contentTypes', localFilters.contentTypes, contentTypes)}
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Campaigns</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Select
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Campaigns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={localFilters.campaigns.includes('all')}
                  onCheckedChange={() => handleFilterChange('campaigns', 'all')}
                >
                  All Campaigns
                </DropdownMenuCheckboxItem>
                {campaigns.filter(c => c !== 'all').map(campaign => (
                  <DropdownMenuCheckboxItem
                    key={campaign}
                    checked={localFilters.campaigns.includes(campaign)}
                    onCheckedChange={() => handleFilterChange('campaigns', campaign)}
                  >
                    {campaign}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap gap-2">
            {renderFilterBadges('campaigns', localFilters.campaigns, campaigns)}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          disabled={!isFiltered}
          className="gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Reset Filters
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={applyFilters} className="gap-2">
            <Check className="h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleFilters;
