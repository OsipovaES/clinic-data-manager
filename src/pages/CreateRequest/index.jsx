import { z } from "zod";
import { Form } from "../../components/Form";
import { Layout } from "../../components/layout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Схема валидации
const createRequestSchema = z.object({
  address: z
    .string()
    .min(3, "Адрес должен содержать хотя бы 3 символа.")
    .max(200, "Адрес не должен быть длиннее 200 символов."),
  contact: z
    .string()
    .regex(
      /^(\+7|7|8)[\d]{10}$/,
      "Контактный номер должен быть формата +7XXXXXXXXXX."
    )
    .min(11, "Контактный номер должен содержать 11 цифр."),
  dateTime: z
    .string()
    .refine(
      (value) => !isNaN(Date.parse(value)),
      "Дата и время должны быть корректными."
    ),
  service: z.string().nonempty("Необходимо выбрать услугу."),
  paymentType: z.string().nonempty("Необходимо выбрать тип оплаты."),
});

export const CreateRequest = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleCreateRequest = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      setErrors({});

      createRequestSchema.parse(data);

      data.dateTime = new Date(data.dateTime).toISOString();
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Ошибка при создании заявки");
        return;
      }

      await response.json();
      alert("Заявка успешно создана!");
      navigate("/requests");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors = {};
        error.errors.forEach((err) => {
          formErrors[err.path[0]] = err.message;
        });
        setErrors(formErrors);
      } else {
        console.error("Ошибка при создании заявки:", error.message);
        alert("Не удалось создать заявку. Попробуйте снова.");
      }
    }
  };

  return (
    <Layout title="Формирование заявки">
      <Form
        description="Заполните данные для новой заявки"
        onSubmit={handleCreateRequest}
        inputs={[
          {
            label: "Адрес",
            placeholder: "Введите адрес",
            name: "address",
            type: "text",
            error: errors.address,
          },
          {
            label: "Контакты",
            placeholder: "+7 (900) 123-45-67",
            name: "contact",
            type: "tel",
            error: errors.contact,
          },
          {
            label: "Дата и время",
            placeholder: "ДД/ММ/ГГ, ЧЧ:ММ",
            name: "dateTime",
            type: "datetime-local",
            error: errors.dateTime,
          },
        ]}
        selects={[
          {
            label: "Услуга",
            name: "service",
            options: [
              { label: "Общий клининг", value: "Общий клининг" },
              { label: "Генеральная уборка", value: "Генеральная уборка" },
              {
                label: "Послестроительная уборка",
                value: "Послестроительная уборка",
              },
              { label: "Химчистка мебели", value: "Химчистка мебели" },
              { label: "Химчистка ковров", value: "Химчистка ковров" },
            ],
            error: errors.service,
          },
          {
            label: "Тип оплаты",
            name: "paymentType",
            options: [
              { label: "Наличные", value: "Наличные" },
              { label: "По карте", value: "По карте" },
            ],
            error: errors.paymentType,
          },
        ]}
        buttonText="Создать заявку"
      />
    </Layout>
  );
};
