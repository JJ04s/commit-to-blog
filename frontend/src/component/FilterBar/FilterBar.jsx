import React from 'react';
import './FilterBar.css';

const FilterBar = ({ filters, onFilterChange, totalCount, repositories }) => {
  const types = ['All', 'Feat', 'Fix', 'Refactor', 'Docs', 'Style'];

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'feat': return '#98c379';
      case 'fix': return '#e06c75';
      case 'refactor': return '#c678dd';
      case 'docs': return '#61afef';
      case 'style': return '#56b6c2';
      default: return '#abb2bf';
    }
  };
  
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <select 
          value={filters.repository} 
          onChange={(e) => onFilterChange('repository', e.target.value)}
        >
          {repositories.map(repo => (
            <option key={repo} value={repo}>
              {repo === 'All' ? 'All Repositories' : repo}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <div className="type-badges">
          {types.map(type => {
            const isActive = filters.type === type;
            const color = isActive ? getTypeColor(type) : 'transparent';
            
            return (
              <button
                key={type}
                className={`type-badge-btn ${isActive ? 'active' : ''}`}
                style={isActive && type !== 'All' ? { 
                  borderColor: color, 
                  color: color,
                  backgroundColor: `${color}15`
                } : {}}
                onClick={() => onFilterChange('type', type)}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <div className="filter-group search-group">
        <input 
          type="text" 
          placeholder="Search (title or #tag)..." 
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>
    </div>
  );
};

export default FilterBar;
