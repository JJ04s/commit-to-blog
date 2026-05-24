import React from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import './FilterBar.css';

const FilterBar = ({ totalCount }) => {
  const { 
    repos, 
    repoFilter, setRepoFilter,
    typeFilter, setTypeFilter,
    tagFilter, setTagFilter 
  } = useGlobalContext();

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
        <label>Repository</label>
        <select 
          value={repoFilter} 
          onChange={(e) => setRepoFilter(e.target.value)}
        >
          <option value="전체">All Repositories</option>
          {repos.map(repo => (
            <option key={repo} value={repo}>
              {repo}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <div className="type-badges">
          {types.map(type => {
            const isActive = type === typeFilter;
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
                onClick={() => setTypeFilter(type)}
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
          onChange={(e) => console.log('Search not implemented yet')}
        />
      </div>
      
      <div className="results-info" style={{ fontSize: '11px', color: '#5c6370', marginLeft: '10px' }}>
        {totalCount} posts
      </div>
    </div>
  );
};

export default FilterBar;
