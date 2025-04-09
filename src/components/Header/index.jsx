import { useNavigate } from "react-router-dom";
import { Button } from "../Button";
import styles from "./header.module.css";

export const Header = () => {
  const navigate = useNavigate();

  const handleNavigateToRequests = () => {
    navigate("/controlPanel");
  };

  const handleNavigateToRegistration = () => {
    navigate("/");
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <header className={styles.head}>
      <div onClick={handleNavigateToRegistration} className={styles.logo}>
        <img
          src="/logo.svg"
          alt="Система учета медицинских данных пациентов"
          className={styles.logoImg}
        />
        <div>
          <h1 className={styles.logoText}>MedTrack</h1>
          <p className={styles.subtitle}>
            система учета медицинских данных пациентов
          </p>
        </div>
      </div>
      <div className={styles.btnWrapper}>
        <Button onClick={handleNavigateToLogin}>Войти</Button>
        <Button onClick={handleNavigateToRequests}>Учет данных</Button>
      </div>
    </header>
  );
};
