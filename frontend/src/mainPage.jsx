import styles from './css/MainPage.module.css';
import PropTypes from "prop-types";


const MainPage = (props) => {
    const { user, navigate, handleLogout, toggleInfo } = props;
        const buttons = [
        { label: "Info", onClick: toggleInfo, img: "/images/info.png" },
        { label: "Todos", onClick: () => navigate(`users/${user.id}/todos`), img: "/images/todos.png" },
        { label: "Posts", onClick: () => navigate(`users/${user.id}/posts`), img: "/images/posts.png" },
        { label: "Albums", onClick: () => navigate(`users/${user.id}/albums`), img: "/images/albums.png" },
        { label: "Logout", onClick: handleLogout, img: "/images/logout.png" },
    ];
    return (
        <div className={styles.container}>
            <h1 className={styles.welcome}>Welcome, {user.name}</h1>

            <div className={styles.navButtons}>
                {buttons.map((btn, index) => (
                    <button key={index} onClick={btn.onClick} className={styles.navButton}>
                        <img src={btn.img} alt={btn.label} className={styles.buttonImage} />
                        <span>{btn.label}</span>
                    </button>
                ))}
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
