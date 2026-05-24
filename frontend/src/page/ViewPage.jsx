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
    
    // 검색 로직 보완
    const searchTerm = filters.search.toLowerCase();
    let matchSearch = true;
    
    if (searchTerm) {
      if (searchTerm.startsWith('#')) {
        // #으로 시작하면 태그에서만 검색 (예: #react -> react 태그 찾기)
        const tagQuery = searchTerm.slice(1);
        matchSearch = post.tags.some(tag => tag.toLowerCase().includes(tagQuery));
      } else {
        // 일반 검색은 제목과 태그 모두 포함
        matchSearch = post.title.toLowerCase().includes(searchTerm) || 
                      post.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      }
    }
    
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
