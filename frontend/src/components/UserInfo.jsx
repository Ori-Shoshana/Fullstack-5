import React from 'react';
import styles from '../css/UserInfo.module.css'; 

export default function UserInfo({ user, onClose }) {
  if (!user) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <button onClick={onClose} className={styles.closeButton}>×</button>

        <h2>User Information</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Website (Password):</strong> {user.website}</p>

        <div className={styles.section}>
          <h4>Address</h4>
          <p>{user.address.street}, {user.address.suite}</p>
          <p>{user.address.city}, {user.address.zipcode}</p>
        </div>

        <div className={styles.section}>
          <h4>Company</h4>
          <p><strong>Name:</strong> {user.company.name}</p>
          <p><strong>CatchPhrase:</strong> {user.company.catchPhrase}</p>
          <p><strong>BS:</strong> {user.company.bs}</p>
        </div>
      </div>
    </div>
  );
}
