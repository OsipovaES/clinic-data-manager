import { useState } from "react";
import { Select } from "../../components/Select";
import { Input } from "../../components/Input";
import styles from "./statusChangeForm.module.css";
import { Button } from "../Button";

export const StatusChangeForm = ({ request, onUpdateStatus }) => {
  const [status, setStatus] = useState(request.status);
  const [reason, setReason] = useState("");

  const isFormValid = () => {
    if (status === "Отклонена" && !reason.trim()) {
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateStatus(request.id, status, reason);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Изменение статуса заявки</h2>

      <Select
        label="Статус:"
        name="status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        options={[
          { label: "ожидает", value: "ожидает" },
          { label: "в работе", value: "в работе" },
          { label: "выполнена", value: "выполнена" },
          { label: "отклонена", value: "отклонена" },
        ]}
      />

      {status === "отклонена" && (
        <Input
          label="Причина отмены:"
          placeholder="Введите причину отмены"
          name="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      )}

      <Button type="submit" disabled={!isFormValid()}>
        Изменить
      </Button>
    </form>
  );
};
