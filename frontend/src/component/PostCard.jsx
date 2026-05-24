import React from 'react';
import './PostCard.css';

const PostCard = ({ post, onEdit }) => {
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

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent triggering card click
    onEdit(post.id);
  };

  return (
    <div className="post-card">
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
        <span className="repo-name">{post.repository}</span>
        <h3 className="post-title">{post.title}</h3>
      </div>
      
      <div className="post-meta">
        <span 
          className="type-badge" 
          style={{ borderColor: getTypeColor(post.type), color: getTypeColor(post.type) }}
        >
          {post.type}
        </span>
        <div className="post-tags">
          {post.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default PostCard;
