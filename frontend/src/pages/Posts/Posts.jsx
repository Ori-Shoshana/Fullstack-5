import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Search from '../../components/Search';
import { create, remove, update, getAll } from '../../api/crudService';
import styles from '../../css/Posts.module.css';
import PostPopup from './PostPopup';
import PostInfoPopup from './PostInfoPopup';

export default function Posts() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [cachePosts, setCachePosts] = useState([]);
  const [searchBy, setSearchBy] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useState(null);

  const [editingPost, setEditingPost] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);

  const fetchPosts = async () => {
    try {
      const data = await getAll('posts', userId);
      setPosts(data);
      setCachePosts(data);
    } catch (err) {
      console.error('Failed to load posts:', err);
      alert('Error loading posts');
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    fetchPosts();
  }, [userId]);

  const savePost = async (idOrNull, data) => {
    if (!data.title.trim() || !data.body.trim()) return;

    if (idOrNull) {
      // Update existing post
      await update('posts', idOrNull, data);
      setPosts((prev) => prev.map((p) => (p.id === idOrNull ? { ...p, ...data } : p)));
      setCachePosts((prev) => prev.map((p) => (p.id === idOrNull ? { ...p, ...data } : p)));
    } else {
      // Create new post
      const newPost = await create('posts', { ...data, userId: parseInt(userId) });
      setPosts((prev) => [...prev, newPost]);
      setCachePosts((prev) => [...prev, newPost]);
    }

    setEditingPost(null);
  };

  const deletePost = async (id) => {
    await remove('posts', id);
    setPosts((prev) => prev.filter((post) => post.id !== id));
    setCachePosts((prev) => prev.filter((post) => post.id !== id));
    setEditingPost(null);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Your Posts</h2>

      <Search
        resource="posts"
        userId={userId}
        setResults={setPosts}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        cachedData={cachePosts}
      />

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
              <button
                className={styles.infoButton}
                onClick={() => setViewingPost(post)}
                title="View Info"
              >
                ℹ️
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        className={styles.fab}
        title="Add new post"
        onClick={() => setEditingPost({ title: '', body: '', userId })}
      >
        ＋
      </button>

      <PostPopup
        post={editingPost}
        onClose={() => setEditingPost(null)}
        onSave={savePost}
        onDelete={deletePost}
      />

      <PostInfoPopup
        post={viewingPost}
        onClose={() => setViewingPost(null)}
        onShowComments={() => {
          setViewingPost(null);
          navigate(`/home/users/${userId}/posts/${viewingPost.id}/comments`);
        }}
      />
    </div>
  );
}
