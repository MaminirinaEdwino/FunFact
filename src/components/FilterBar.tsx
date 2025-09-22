import { Search, Filter, SortAsc } from 'lucide-react';
import React from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Filter as FilterType } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  selectedTag: string;
  onTagChange: (tag: string) => void;
  availableTags: string[];
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  currentFilter,
  onFilterChange,
  selectedTag,
  onTagChange,
  availableTags
}: FilterBarProps) {
  return (
    <div className="bg-card border-b">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex flex-col gap-3 md:gap-4">
          {/* Search bar - full width on mobile */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher un fun fact..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filters - stacked on mobile, inline on larger screens */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Select value={currentFilter} onValueChange={(value: FilterType) => onFilterChange(value)}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="recent">Récents</SelectItem>
                <SelectItem value="popular">Populaires</SelectItem>
                <SelectItem value="controversial">Controversés</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedTag || "all"} onValueChange={(value) => onTagChange(value === "all" ? "" : value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SortAsc className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Tous les tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les tags</SelectItem>
                {availableTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    #{tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}