import { Router } from "express";
import { createTreatment, getTreatmentById } from "../db/queries.js"; // Функции для лечения

const router = Router();

// Добавление нового лечения
router.post("/", async (req, res) => {
  try {
    const newTreatment = await createTreatment(req.body);
    res.status(201).json(newTreatment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получение лечения по ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const treatment = await getTreatmentById(id);
    if (!treatment) {
      return res.status(404).json({ error: "Лечение не найдено" });
    }
    res.json(treatment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
