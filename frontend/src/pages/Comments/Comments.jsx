import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { create, remove, update, getAllBy } from '../../api/crudService';
import styles from '../../css/Comments/Comments.module.css';
import CommentPopup from './CommentPopup';
import CommentList from './CommentsList';
import AddCommentForm from './AddCommentForm';

export default function Comments() {
  const { userId, postId } = useParams();
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const user = JSON.parse(localStorage.getItem('activeUser'));

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getAllBy('comments', 'postId', postId);
        setComments(data);
      } catch (err) {
        console.error('Failed to load comments:', err);
        alert('Error loading comments');
      }
    };

    fetchComments();
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
    <button
      onClick={() => navigate(`/home/users/${userId}/posts`)}
      className={styles.backButton}
    >
      ← Back to Post
    </button>

    <h2 className={styles.title}>Comments for Post #{postId}</h2>

    <CommentList
      comments={comments}
      currentUser={user}
      onEdit={setEditingComment}
      onDelete={deleteComment}
    />

    <AddCommentForm
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      onSubmit={addComment}
    />

    <CommentPopup
      comment={editingComment}
      onClose={() => setEditingComment(null)}
      onSave={updateComment}
    />
  </div>
);

}
