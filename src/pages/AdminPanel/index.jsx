import { useEffect, useState } from "react";
import { Card } from "../../components/Card";
import { Modal } from "../../components/Modal";
import { StatusChangeForm } from "../../components/StatusChangeForm";
import { Layout } from "../../components/layout";
import styles from "./adminPanel.module.css";

export const AdminPanel = () => {
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/requests");
        if (!response.ok) {
          throw new Error("Не удалось получить заявки");
        }
        const data = await response.json();

        console.log("Полученные данные с сервера:", data);

        const formattedData = data.map((request) => {
          return {
            id: request.id,
            title: `Заявка №${request.id}`,
            data: [
              { label: "Услуга", value: request.service || "Не указано" },
              { label: "Адрес", value: request.address || "Не указано" },
              { label: "Контакты", value: request.contact || "Не указано" },
              {
                label: "Дата и время",
                value: request.date_time
                  ? new Date(request.date_time).toLocaleString("ru-RU")
                  : "Не указано",
              },
              {
                label: "Тип оплаты",
                value: request.payment_type || "Не указано",
              },
            ],
            status: request.status,
          };
        });

        setRequests(formattedData);
      } catch (error) {
        console.error("Ошибка при получении заявок:", error.message);
      }
    };

    fetchRequests();
  }, []);

  const handleOpenModal = (request) => {
    setCurrentRequest(request);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentRequest(null);
  };

  const handleUpdateStatus = async (id, status, reason) => {
    console.log("Передача данных на сервер:", { id, status, reason });

    try {
      const response = await fetch(`/api/requests/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, reason }),
      });

      if (!response.ok) {
        throw new Error("Не удалось обновить статус");
      }

      const updatedRequest = await response.json();
      console.log(
        "Полученные данные после обновления статуса:",
        updatedRequest
      );

      setRequests((prev) =>
        prev.map((request) =>
          request.id === updatedRequest.id
            ? { ...request, status: updatedRequest.status }
            : request
        )
      );

      handleCloseModal();
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error.message);
      alert("Не удалось обновить статус заявки. Попробуйте снова.");
    }
  };

  return (
    <Layout title="Панель администратора">
      <div className={styles.adminPanel}>
        <div className={styles.cardContainer}>
          {requests.map((request) => (
            <Card
              key={request.id}
              title={request.title}
              data={request.data}
              status={request.status}
              buttonText="Изменить статус"
              onButtonClick={() => handleOpenModal(request)}
            />
          ))}
        </div>

        {isModalOpen && currentRequest && (
          <Modal onClose={handleCloseModal}>
            <StatusChangeForm
              request={currentRequest}
              onUpdateStatus={handleUpdateStatus}
            />
          </Modal>
        )}
      </div>
    </Layout>
  );
};
