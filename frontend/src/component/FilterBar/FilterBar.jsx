import React from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import './FilterBar.css';

const FilterBar = ({ totalCount }) => {
  const { 
    posts,
    repos, 
    repoFilter, setRepoFilter,
    typeFilter, setTypeFilter,
    tagFilter, setTagFilter,
    searchTerm, setSearchTerm
  } = useGlobalContext();

  const types = ['All', 'Feat', 'Fix', 'Refactor', 'Docs', 'Style'];

  // 현재 포스트들에서 고유 태그 추출
  const availableTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));

  const handleTagToggle = (tag) => {
    if (tagFilter.includes(tag)) {
      setTagFilter(tagFilter.filter(t => t !== tag));
    } else {
      setTagFilter([...tagFilter, tag]);
    }
  };

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
          placeholder="Search title or content..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="tag-filters">
        {availableTags.map(tag => (
          <button
            key={tag}
            className={`filter-tag-badge ${tagFilter.includes(tag) ? 'active' : ''}`}
            onClick={() => handleTagToggle(tag)}
          >
            #{tag}
          </button>
        ))}
      </div>
      
      <div className="results-info" style={{ fontSize: '11px', color: '#5c6370', marginLeft: '10px' }}>
        {totalCount} posts
      </div>
    </div>
  );
};

export default FilterBar;
