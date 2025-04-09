import { useNavigate } from "react-router-dom";
import { Button } from "../Button";
import styles from "./header.module.css";

export const Header = () => {
  const navigate = useNavigate();

  const handleNavigateToRequests = () => {
    navigate("/requests");
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
        <img src="/logo.svg" alt="Клининг, мой не сам" />
        <div>
          <h1 className={styles.logoText}>Мой Не Сам</h1>
          <p className={styles.subtitle}>Портал клининговых услуг</p>
        </div>
      </div>
      <div className={styles.btnWrapper}>
        <Button onClick={handleNavigateToLogin}>Войти</Button>
        <Button onClick={handleNavigateToRequests}>Создать заявку</Button>
      </div>
    </header>
  );
};
