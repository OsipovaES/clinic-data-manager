import { useEffect, useState } from "react";
import { Layout } from "../../components/layout";
import { Modal } from "../../components/Modal";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import styles from "./controlPanel.module.css";

export const ControlPanel = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    diagnosis: "",
    birthDate: "",
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("/api/patients");
        const data = await res.json();
        setPatients(data);
      } catch (err) {
        console.error("Ошибка загрузки пациентов:", err);
      }
    };
    fetchPatients();
  }, []);

  const handleUpdatePatient = async () => {
    try {
      await fetch(`/api/patients/${selectedPatient._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPatient),
      });
      setSelectedPatient(null);
    } catch (err) {
      console.error("Ошибка обновления:", err);
    }
  };

  const handleAddPatient = async () => {
    try {
      await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setIsAddModalOpen(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        diagnosis: "",
        birthDate: "",
      });
    } catch (err) {
      console.error("Ошибка добавления:", err);
    }
  };

  return (
    <Layout title="Панель управления">
      <div className={styles.actions}>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Добавить пациента
        </Button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Дата приёма</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p._id} onClick={() => setSelectedPatient(p)}>
              <td>{p.name}</td>
              <td>
                {p.lastVisitDate
                  ? new Date(p.lastVisitDate).toLocaleDateString("ru-RU")
                  : "Не указана"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPatient && (
        <Modal onClose={() => setSelectedPatient(null)}>
          <h2>{selectedPatient.name}</h2>
          <Input
            label="Телефон"
            value={selectedPatient.phone}
            onChange={(e) =>
              setSelectedPatient({ ...selectedPatient, phone: e.target.value })
            }
          />
          <Input
            label="Email"
            value={selectedPatient.email}
            onChange={(e) =>
              setSelectedPatient({ ...selectedPatient, email: e.target.value })
            }
          />
          <Input
            label="Диагноз"
            value={selectedPatient.diagnosis}
            onChange={(e) =>
              setSelectedPatient({
                ...selectedPatient,
                diagnosis: e.target.value,
              })
            }
          />
          <Input
            label="Дата рождения"
            type="date"
            value={selectedPatient.birthDate?.slice(0, 10)}
            onChange={(e) =>
              setSelectedPatient({
                ...selectedPatient,
                birthDate: e.target.value,
              })
            }
          />
          <div className={styles.historySection}>
            <h3>История болезни</h3>
            {selectedPatient.history && selectedPatient.history.length > 0 ? (
              <ul className={styles.historyList}>
                {selectedPatient.history.map((record, idx) => (
                  <li key={idx}>
                    <strong>
                      {new Date(record.date).toLocaleDateString("ru-RU")}
                    </strong>
                    : {record.notes}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Нет записей</p>
            )}
          </div>
          <Button onClick={handleUpdatePatient}>Сохранить изменения</Button>
        </Modal>
      )}

      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)}>
          <h2>Новый пациент</h2>
          <Input
            label="Имя"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Телефон"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <Input
            label="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <Input
            label="Диагноз"
            value={formData.diagnosis}
            onChange={(e) =>
              setFormData({ ...formData, diagnosis: e.target.value })
            }
          />
          <Input
            label="Дата рождения"
            type="date"
            value={formData.birthDate}
            onChange={(e) =>
              setFormData({ ...formData, birthDate: e.target.value })
            }
          />
          <Button onClick={handleAddPatient}>Добавить</Button>
        </Modal>
      )}
    </Layout>
  );
};
