import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import FilterBar from '../../component/FilterBar/FilterBar';
import PostCard from '../../component/PostCard/PostCard';
import { useGlobalContext } from '../../context/GlobalContext';
import { postService } from '../../api/postService';
import './ViewPage.css';

const ViewPage = () => {
  const navigate = useNavigate();
  const { 
    posts, setPosts, 
    repoFilter,
    typeFilter,
    tagFilter,
    searchTerm,
    setTitle, setContent, setTags,
    setEditingPostId,
    setSelectedRepo,
    setSelectedCommit
  } = useGlobalContext();
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPostForView, setSelectedPostForView] = useState(null);

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
    const matchTag = tagFilter.length === 0 || tagFilter.every(t => (post.tags || []).includes(t));
    const matchSearch = !searchTerm || 
      (post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase()));
      
    return matchRepo && matchType && matchTag && matchSearch;
  });

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setTags(post.tags || []);
    setEditingPostId(post._id);
    setSelectedRepo(post.repoName);
    setSelectedCommit({ sha: post.commitSha });
    navigate('/write');
  };

  const handleDelete = async (id) => {
    console.log("Delete triggered for ID:", id); // 디버깅 로그 추가
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      await postService.deletePost(id);
      alert('삭제되었습니다.');
      // 목록에서 즉시 제거
      setPosts(prevPosts => prevPosts.filter(p => p._id !== id));
      if (selectedPostForView && selectedPostForView._id === id) {
        setSelectedPostForView(null);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <div className="view-page loading">Loading posts from DB...</div>;
  }

  // 상세 보기 화면
  if (selectedPostForView) {
    return (
      <div className="post-detail-view">
        <div className="detail-header">
          <button className="back-btn" onClick={() => setSelectedPostForView(null)}>
            ← Back to List
          </button>
          <div className="detail-actions">
            <button className="edit-action-btn" onClick={() => handleEdit(selectedPostForView)}>
              Edit Post
            </button>
            <button className="delete-action-btn" onClick={() => handleDelete(selectedPostForView._id)}>
              Delete
            </button>
          </div>
        </div>
        <article className="detail-content">
          <header className="content-header">
            <span className="detail-repo">{selectedPostForView.repoName}</span>
            <h1 className="detail-title">{selectedPostForView.title}</h1>
            <div className="detail-meta">
              <span className="detail-type">{selectedPostForView.type || 'Post'}</span>
              <div className="detail-tags">
                {(selectedPostForView.tags || []).map(tag => (
                  <span key={tag} className="detail-tag">#{tag}</span>
                ))}
              </div>
              <span className="detail-date">{new Date(selectedPostForView.createdAt).toLocaleDateString()}</span>
            </div>
          </header>
          <div className="content-body markdown-body">
            <ReactMarkdown>{selectedPostForView.content}</ReactMarkdown>
          </div>
        </article>
      </div>
    );
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
              <PostCard 
                key={post._id} 
                post={post} 
                onEdit={() => handleEdit(post)}
                onDelete={() => handleDelete(post._id)}
                onClick={() => setSelectedPostForView(post)} 
              />
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
