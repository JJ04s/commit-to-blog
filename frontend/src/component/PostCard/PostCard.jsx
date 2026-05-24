import React from 'react';
import './PostCard.css';

const PostCard = ({ post, onEdit, onClick }) => {
  // 방어 코드: post나 post.type이 없을 경우 대비
  const getTypeColor = (type = 'feat') => {
    const safeType = type ? type.toLowerCase() : 'feat';
    switch (safeType) {
      case 'feat': return '#98c379';
      case 'fix': return '#e06c75';
      case 'refactor': return '#c678dd';
      case 'docs': return '#61afef';
      case 'style': return '#56b6c2';
      default: return '#abb2bf';
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // 카드 클릭(상세보기) 방지
    if (onEdit) onEdit(post._id);
  };

  return (
    <div className="post-card" onClick={onClick}>
      <button 
        className="edit-button" 
        onClick={handleEditClick}
        title="Edit Post"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>

      <div className="card-header">
        <span className="repo-name">{post.repoName || 'Unknown Repository'}</span>
        <h3 className="post-title">{post.title}</h3>
      </div>
      
      <div className="post-meta">
        <span 
          className="type-badge" 
          style={{ 
            borderColor: getTypeColor(post.type), 
            color: getTypeColor(post.type) 
          }}
        >
          {post.type || 'Post'}
        </span>
        <div className="post-tags">
          {post.tags && post.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <span className="post-date">
          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'No Date'}
        </span>
      </div>
    </div>
  );
};

export default PostCard;
