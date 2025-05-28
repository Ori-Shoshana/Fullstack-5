import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Search from '../../components/Search';
import { create, remove, update, getAll } from '../../api/crudService';
import styles from '../../css/Posts/Posts.module.css';
import PostPopup from './PostPopup';
import PostInfoPopup from './PostInfoPopup';
import PostList from './PostList';
import BackButton from '../../components/buttons/BackButton';
import FloatingActionButton from '../../components/buttons/FloatingActionButton';

export default function Posts() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [cachePosts, setCachePosts] = useState([]);
  const [searchBy, setSearchBy] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useState(null);
  const [formError, setFormError] = useState('');

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
    if (!data.title.trim() || !data.body.trim()) {
      setFormError("Please fill in both title and body.");
      return;
    }

    setFormError("");

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
    <div>
      <BackButton to="/home" label="Back to Home" />
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

      <PostList
        posts={posts}
        onEdit={setEditingPost}
        onView={setViewingPost}
      />

      <FloatingActionButton
        title="Add new post"
        onClick={() => setEditingPost({ title: '', body: '', userId })}
      />

      <PostPopup
        post={editingPost}
        onClose={() => {
          setFormError('');
          setEditingPost(null);
        }}
        onSave={savePost}
        onDelete={deletePost}
        error={formError}
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
