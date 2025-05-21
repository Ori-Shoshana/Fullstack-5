import styles from './css/MainPage.module.css';
import PropTypes from "prop-types";


const MainPage = (props) => {
    const { user, navigate, handleLogout, toggleInfo } = props;
    return (
        <div className={styles.container}>
            <h1 className={styles.welcome}>Welcome, {user.name}</h1>

            <div className={styles.navButtons}>
                <button onClick={toggleInfo}>Info</button>
                <button onClick={() => navigate(`users/${user.id}/todos`)}>Todos</button>
                <button onClick={() => navigate(`users/${user.id}/posts`)}>Posts</button>
                <button onClick={() => navigate(`users/${user.id}/albums`)}>Albums</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

MainPage.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
    navigate: PropTypes.func.isRequired,
    handleLogout: PropTypes.func.isRequired,
    toggleInfo: PropTypes.func.isRequired,
};
export default MainPage;