import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../css/Comments.module.css'; // ניצור בהמשך

export default function Comments() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/comments?postId=${postId}`)
      .then((res) => setComments(res.data))
      .catch((err) => {
        console.error('Failed to load comments:', err);
        alert('Error loading comments');
      });
  }, [postId]);

  return (
    <div className={styles.wrapper}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        ← Back to Post
      </button>

      <h2 className={styles.title}>Comments for Post #{postId}</h2>

      <ul className={styles.commentList}>
        {comments.length === 0 && <p>No comments yet.</p>}
        {comments.map((comment) => (
          <li key={comment.id} className={styles.comment}>
            <h4>{comment.name} ({comment.email})</h4>
            <p>{comment.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
