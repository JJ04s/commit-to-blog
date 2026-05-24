import React, { useState } from 'react';
import './PostEditor.css';

const PostEditor = ({ initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');

  return (
    <div className="post-editor">
      <div className="editor-toolbar">
        <div className="editor-status">
          {initialData.sha ? `Editing: ${initialData.sha.substring(0, 7)}` : 'New Post'}
        </div>
        <button className="ai-gen-btn">✨ AI 요약 생성</button>
      </div>

      <div className="editor-main">
        <div className="editor-input-group">
          <input 
            type="text" 
            className="title-input" 
            placeholder="Post Title..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="editor-content-wrapper">
          <textarea 
            className="content-textarea" 
            placeholder="Markdown content goes here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="markdown-preview">
            {/* TODO: Add react-markdown for preview */}
            <div className="preview-label">PREVIEW</div>
            <div className="preview-placeholder">
              {content || 'Content preview will appear here...'}
            </div>
          </div>
        </div>
      </div>

      <div className="editor-footer">
        <div className="tag-input-area">
          <input type="text" placeholder="Add tags (Enter)..." className="tag-input" />
        </div>
        <button className="save-btn">Save Post</button>
      </div>
    </div>
  );
};

export default PostEditor;
