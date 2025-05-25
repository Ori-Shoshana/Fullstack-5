import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/user.module.css';

const RegisterDetailsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    suite: '',
    city: '',
    zipcode: '',
    companyName: '',
    catchPhrase: '',
    bs: '',
    lat: '',
    lng: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const authData = localStorage.getItem('newUserAuth');
    if (!authData) {
      alert('Please start registration from the beginning.');
      navigate('/register');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const authData = JSON.parse(localStorage.getItem('newUserAuth'));

    try {
      const usersRes = await fetch('http://localhost:3000/users');
      const users = await usersRes.json();

      const ids = users.map(u => parseInt(u.id)).filter(id => !isNaN(id));
      const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;

      const fullUser = {
        id: newId,
        username: authData.username,
        website: authData.password,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          suite: formData.suite,
          city: formData.city,
          zipcode: formData.zipcode,
          geo: {
            lat: formData.lat,
            lng: formData.lng
          }
        },
        company: {
          name: formData.companyName,
          catchPhrase: formData.catchPhrase,
          bs: formData.bs
        }
      };

      const res = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullUser)
      });

      if (!res.ok) {
        throw new Error('Failed to save user');
      }

      const savedUser = await res.json();
      localStorage.setItem('activeUser', JSON.stringify(savedUser));
      localStorage.removeItem('newUserAuth');
      navigate('/home');

    } catch (error) {
      console.error('Registration failed:', error);
      alert('Error during registration. Please try again.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit}>
        <h1>Complete Registration</h1>

        <div className={styles.inputBox}>
          <input name="name" placeholder="Full Name" required onChange={handleChange} />
        </div>

        <div className={styles.inputBox}>
          <input name="email" type="email" placeholder="Email" required onChange={handleChange} />
        </div>

        <div className={styles.inputBox}>
          <input name="phone" placeholder="Phone" required onChange={handleChange} />
        </div>

        <div className={styles.inputBox}>
          <input name="street" placeholder="Street" required onChange={handleChange} />
        </div>

        <div className={styles.inputBox}>
          <input name="suite" placeholder="Suite / Apartment" required onChange={handleChange} />
        </div>

        <div className={styles.inputBox}>
          <input name="city" placeholder="City" required onChange={handleChange} />
        </div>

        <div className={styles.inputBox}>
          <input name="zipcode" placeholder="Zip Code" required onChange={handleChange} />
        </div>

        <div className={styles.inputBox}>
          <input name="lat" placeholder="Latitude" required onChange={handleChange} />
        </div>

        <div className={styles.inputBox}>
          <input name="lng" placeholder="Longitude" required onChange={handleChange} />
        </div>

        <div className={styles.inputBox}>
          <input name="companyName" placeholder="Company Name" required onChange={handleChange} />
        </div>

        <div className={styles.inputBox}>
          <input name="catchPhrase" placeholder="Catch Phrase" required onChange={handleChange} />
        </div>

        <div className={styles.inputBox}>
          <input name="bs" placeholder="Business Slogan (bs)" required onChange={handleChange} />
        </div>

        <button type="submit" className={styles.btn}>Register</button>
      </form>
    </div>
  );
};

export default RegisterDetailsPage;