import styles from "./select.module.css";

export const Select = ({ label, name, value, onChange, options }) => {
  return (
    <div className={styles.selectWrapper}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={styles.select}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
