import { useEffect, useState } from "react";
import { Layout } from "../../components/layout";
import { Card } from "../../components/Card";
import { useNavigate } from "react-router-dom";
import styles from "./requests.module.css";

export const Requests = () => {
  const navigate = useNavigate();
  const handleCreateRequest = () => {
    navigate("/create-request");
  };

  const [requestsData, setRequestsData] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/requests");
        if (!response.ok) {
          throw new Error("Не удалось получить заявки");
        }
        const data = await response.json();
        const formattedData = data.map((request) => {
          return {
            title: request.service,
            details: `Адрес: ${request.address}, Контакт: ${request.contact}`,
            data: [
              {
                label: "Дата",
                value: request.date_time
                  ? new Date(request.date_time).toLocaleString("ru-RU")
                  : "Не указано",
              },
              { label: "Оплата", value: request.payment_type || "Не указано" },
            ],
            status: request.status,
          };
        });
        setRequestsData(formattedData);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchRequests();
  }, []);

  return (
    <Layout title="История заявок">
      <div className={styles.container}>
        <Card
          title="Понравились наши услуги?"
          buttonText="Создать новую заявку"
          onButtonClick={handleCreateRequest}
        />
        {requestsData.map((request, index) => (
          <Card
            key={index}
            title={request.title}
            details={request.details}
            data={request.data}
            status={request.status}
          />
        ))}
      </div>
    </Layout>
  );
};
