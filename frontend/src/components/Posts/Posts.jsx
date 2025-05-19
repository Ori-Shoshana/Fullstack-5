import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Search from '../Search';
import styles from '../../css/Posts.module.css';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchBy, setSearchBy] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('activeUser'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    axios
      .get(`http://localhost:3000/posts?userId=${user.id}`)
      .then((res) => setPosts(res.data))
      .catch((err) => {
        console.error('Failed to load posts:', err);
        alert('Error loading posts');
      });
  }, []);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Your Posts</h2>

      {/* Search bar */}
      <Search
        resource="posts"
        setResults={setPosts}
        userId={user.id}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <ul className={styles.list}>
        {posts.map((post) => (
          <li key={post.id} className={styles.item}>
            <div className={styles.preview}>
              <strong>Post #{post.id}</strong> – {post.title}
            </div>
            <button onClick={() => setSelectedPost(post)}>View</button>
          </li>
        ))}
      </ul>

      {selectedPost && (
        <div className={styles.selected}>
          <h3>{selectedPost.title}</h3>
          <p>{selectedPost.body}</p>
          <button onClick={() => navigate(`comments/${selectedPost.id}`)}>
            Show Comments
          </button>
        </div>
      )}
    </div>
  );
}
