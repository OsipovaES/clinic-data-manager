import styles from "./form.module.css";
import { Input } from "../Input";
import { Button } from "../Button";
import { Select } from "../Select";

export const Form = ({
  description,
  inputs,
  selects,
  onSubmit,
  buttonText,
}) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {description && <p className={styles.description}>{description}</p>}

      {/* Рендеринг текстовых полей */}
      {inputs &&
        inputs.map((input, index) => (
          <Input
            key={index}
            label={input.label}
            placeholder={input.placeholder}
            type={input.type}
            name={input.name}
            value={input.value}
            onChange={input.onChange}
            error={input.error}
          />
        ))}

      {/* Рендеринг селектов */}
      {selects &&
        selects.map((select, index) => (
          <Select
            key={index}
            label={select.label}
            name={select.name}
            value={select.value}
            onChange={select.onChange}
            options={select.options}
          />
        ))}

      <Button type="submit">{buttonText || "Submit"}</Button>
    </form>
  );
};
