import React, { useState } from 'react';
import FilterBar from '../component/FilterBar';
import PostCard from '../component/PostCard';
import { MOCK_POSTS, getMockRepositories } from '../api/mockData';
import './ViewPage.css';

const ViewPage = () => {
  const [filters, setFilters] = useState({
    repository: 'All',
    type: 'All',
    search: ''
  });

  const repositories = getMockRepositories();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredPosts = MOCK_POSTS.filter(post => {
    const matchRepo = filters.repository === 'All' || post.repository === filters.repository;
    const matchType = filters.type === 'All' || post.type === filters.type;
    const matchSearch = post.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                        post.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
    
    return matchRepo && matchType && matchSearch;
  });

  const handleEdit = (id) => {
    console.log(`Edit post with id: ${id}`);
  };

  return (
    <div className="view-page">
      <FilterBar 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        totalCount={filteredPosts.length}
        repositories={repositories}
      />
      
      <div className="view-content-scroll">
        <div className="posts-grid">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <PostCard key={post.id} post={post} onEdit={handleEdit} />
            ))
          ) : (
            <div className="no-results">
              <p>조건에 맞는 포스트가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPage;
