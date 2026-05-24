import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { postService } from '../../api/postService';
import './PostEditor.css';

const PostEditor = ({ initialData = {} }) => {
  const { 
    title, setTitle, 
    content, setContent, 
    tags, setTags,
    selectedRepo,
    selectedCommit,
    setActiveTab,
    setPosts
  } = useGlobalContext();

  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // 초기 데이터 또는 선택된 커밋 변경 시 동기화 (SHA가 바뀔 때만)
  useEffect(() => {
    if (initialData.sha) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
    }
  }, [initialData.sha, setTitle, setContent]);

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please enter both title and content.');
      return;
    }

    if (!selectedCommit) {
      alert('Please select a commit first.');
      return;
    }

    setIsSaving(true);
    try {
      const postData = {
        title,
        content,
        tags,
        repoName: selectedRepo,
        commitSha: selectedCommit.sha,
        githubUrl: selectedCommit.html_url || `https://github.com/${selectedRepo}/commit/${selectedCommit.sha}`
      };

      await postService.createPost(postData);
      
      // 저장 성공 후 목록 갱신 및 탭 전환
      const updatedPosts = await postService.getPosts();
      setPosts(updatedPosts);
      
      alert('Post saved successfully!');
      setActiveTab('VIEW');
    } catch (error) {
      console.error('Failed to save post:', error);
      alert(`Error: ${error.response?.data?.message || 'Failed to save post'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="post-editor">
      <div className="editor-toolbar">
        <div className="editor-status">
          {selectedCommit ? `Commit: ${selectedCommit.sha.substring(0, 7)}` : 'No Commit Selected'}
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
            <div className="preview-label">PREVIEW</div>
            <div className="preview-placeholder">
              {content || 'Content preview will appear here...'}
            </div>
          </div>
        </div>
      </div>

      <div className="editor-footer">
        <div className="tag-input-area">
          <div className="tags-display">
            {tags.map(tag => (
              <span key={tag} className="tag-badge">
                {tag} <span className="tag-remove" onClick={() => removeTag(tag)}>×</span>
              </span>
            ))}
          </div>
          <input 
            type="text" 
            placeholder="Add tags (Enter)..." 
            className="tag-input" 
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
          />
        </div>
        <button 
          className="save-btn" 
          onClick={handleSave}
          disabled={isSaving || !selectedCommit}
        >
          {isSaving ? 'Saving...' : 'Save Post'}
        </button>
      </div>
    </div>
  );
};

export default PostEditor;
