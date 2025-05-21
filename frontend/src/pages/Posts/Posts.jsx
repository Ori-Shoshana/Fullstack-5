import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Search from '../../components/Search';
import { create, remove, update } from '../../api/crudService';
import styles from '../../css/Posts.module.css';
import PostPopup from './PostPopup';

export default function Posts() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  const [searchBy, setSearchBy] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    axios
      .get(`http://localhost:3000/posts?userId=${userId}`)
      .then((res) => setPosts(res.data))
      .catch((err) => {
        console.error('Failed to load posts:', err);
        alert('Error loading posts');
      });
  }, [userId]);

  const addPost = async () => {
    if (!newTitle.trim() || !newBody.trim()) return;

    const newPost = await create('posts', {
      userId: parseInt(userId),
      title: newTitle.trim(),
      body: newBody.trim(),
    });

    setPosts((prev) => [...prev, newPost]);
    setNewTitle('');
    setNewBody('');
  };

  const deletePost = async (id) => {
    await remove("posts", id);
    setPosts((prev) => prev.filter((post) => post.id !== id));
    if (selectedPost?.id === id) setSelectedPost(null);
  };

  const updatePost = async (id, updatedData) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, ...updatedData } : post))
    );
    await update("posts", id, updatedData);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Your Posts</h2>

      {/* Search bar */}
      <Search
        resource="posts"
        setResults={setPosts}
        userId={userId}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Add new post */}
      <div className={styles.addContainer}>
        <input
          className={styles.input}
          type="text"
          placeholder="Post title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          className={styles.input}
          placeholder="Post body"
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
        />
        <button className={styles.addButton} onClick={addPost}>
          Add Post
        </button>
      </div>

      <ul className={styles.list}>
        {posts.map((post) => (
          <li
            key={post.id}
            className={styles.item}
            onDoubleClick={() => setEditingPost(post)}
          >
            <div className={styles.preview}>
              <strong>Post #{post.id}</strong> – {post.title}
            </div>

            <div>
              <button onClick={() => setSelectedPost(post)}>View</button>
              <button onClick={() => deletePost(post.id)} title="Delete Post">
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedPost && (
        <div className={styles.selected}>
          <h3>{selectedPost.title}</h3>
          <p>{selectedPost.body}</p>
          <button onClick={() => navigate(`users/${userId}/posts/${selectedPost.id}/comments`)}>
            Show Comments
          </button>
        </div>
      )}

      <PostPopup
        post={editingPost}
        onClose={() => setEditingPost(null)}
        onSave={updatePost}
      />
    </div>
  );
}
