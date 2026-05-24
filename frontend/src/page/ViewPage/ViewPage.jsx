import React, { useEffect, useState } from 'react';
import FilterBar from '../../component/FilterBar/FilterBar';
import PostCard from '../../component/PostCard/PostCard';
import { useGlobalContext } from '../../context/GlobalContext';
import { postService } from '../../api/postService';
import './ViewPage.css';

const ViewPage = () => {
  const { 
    posts, setPosts, 
    repoFilter,
    typeFilter,
    tagFilter 
  } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const data = await postService.getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [setPosts]);

  // 필터링 로직
  const filteredPosts = posts.filter(post => {
    const matchRepo = repoFilter === "전체" || post.repoName === repoFilter;
    const matchType = typeFilter === "All" || post.type === typeFilter;
    const matchTag = tagFilter.length === 0 || tagFilter.every(t => post.tags.includes(t));
    return matchRepo && matchType && matchTag;
  });

  const handleEdit = (id) => {
    console.log(`Edit post with id: ${id}`);
    // TODO: F3-2 수정 모드 구현 시 완성
  };

  if (isLoading) {
    return <div className="view-page loading">Loading posts from DB...</div>;
  }

  return (
    <div className="view-page">
      <FilterBar 
        totalCount={filteredPosts.length}
      />
      
      <div className="view-content-scroll">
        <div className="posts-grid">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <PostCard key={post._id} post={post} onEdit={() => handleEdit(post._id)} />
            ))
          ) : (
            <div className="no-results">
              <p>저장된 포스트가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPage;
