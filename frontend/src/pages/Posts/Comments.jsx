import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { create, remove, update } from '../../api/crudService';
import styles from '../../css/Comments.module.css';
import CommentPopup from './CommentPopup';

export default function Comments() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const user = JSON.parse(localStorage.getItem('activeUser'));

  useEffect(() => {
    axios
      .get(`http://localhost:3000/comments?postId=${postId}`)
      .then((res) => setComments(res.data))
      .catch((err) => {
        console.error('Failed to load comments:', err);
        alert('Error loading comments');
      });
  }, [postId]);

  const addComment = async () => {
    if (!newComment.trim()) return;

    const commentData = {
      postId: parseInt(postId),
      name: user.name || "Anonymous",
      email: user.email || `${user.username}@mail.com`,
      body: newComment.trim(),
    };

    const saved = await create("comments", commentData);
    setComments((prev) => [...prev, saved]);
    setNewComment("");
  };

  const deleteComment = async (id) => {
    await remove("comments", id);
    setComments((prev) => prev.filter((comment) => comment.id !== id));
  };

  const updateComment = async (id, updatedData) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
    await update("comments", id, updatedData);
  };

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
            <div className={styles.commentHeader}>
              <h4>{comment.name} ({comment.email})</h4>
              {comment.email === user.email && (
                <div>
                  <button
                    onClick={() => setEditingComment(comment)}
                    className={styles.editButton}
                    title="Edit comment"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className={styles.deleteButton}
                    title="Delete comment"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
            <p>{comment.body}</p>
          </li>
        ))}
      </ul>

      <div className={styles.commentForm}>
        <textarea
          className={styles.input}
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={addComment} className={styles.submitButton}>
          Submit Comment
        </button>
      </div>

      <CommentPopup
        comment={editingComment}
        onClose={() => setEditingComment(null)}
        onSave={updateComment}
      />
    </div>
  );
}
