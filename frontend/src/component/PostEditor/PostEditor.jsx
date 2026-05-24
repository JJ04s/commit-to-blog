import React, { useState, useEffect, useRef } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { postService } from '../../api/postService';
import './PostEditor.css';

const PostEditor = () => {
  const { 
    title, setTitle, 
    content, setContent, 
    tags, setTags,
    selectedRepo,
    selectedCommit,
    setActiveTab,
    setPosts,
    editingPostId, setEditingPostId
  } = useGlobalContext();

  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const lastSha = useRef(null);

  // 새로운 커밋이 선택되었을 때만 에디터 초기화
  useEffect(() => {
    // 수정 모드가 아닐 때만 자동 초기화 수행
    if (!editingPostId && selectedCommit && selectedCommit.sha !== lastSha.current) {
      setTitle(selectedCommit.message || '');
      setContent(`Summary for commit: ${selectedCommit.sha}\n\nThis is an auto-generated placeholder content.`);
      lastSha.current = selectedCommit.sha;
    }
  }, [selectedCommit, setTitle, setContent, editingPostId]);

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

      if (editingPostId) {
        // 기존 포스트 수정 (PUT)
        await postService.updatePost(editingPostId, postData);
        alert('Post updated successfully!');
      } else {
        // 신규 포스트 생성 (POST)
        await postService.createPost(postData);
        alert('Post saved successfully!');
      }
      
      // 상태 초기화 및 이동
      const updatedPosts = await postService.getPosts();
      setPosts(updatedPosts);
      setEditingPostId(null); // 수정 모드 해제
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
          {editingPostId ? `Editing Post: ${editingPostId}` : (selectedCommit ? `Commit: ${selectedCommit.sha.substring(0, 7)}` : 'No Commit Selected')}
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
          {isSaving ? 'Saving...' : (editingPostId ? 'Update Post' : 'Save Post')}
        </button>
      </div>
    </div>
  );
};

export default PostEditor;
