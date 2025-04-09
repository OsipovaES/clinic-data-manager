import { Router } from "express";
import { createTreatment, getTreatmentById } from "../db/queries.js";

const router = Router();

// Добавление нового лечения
router.post("/", async (req, res) => {
  const { patientId, medications, treatmentDate, description } = req.body;

  try {
    const newTreatment = await createTreatment({
      patientId,
      medications,
      treatmentDate,
      description,
    });

    const updatedPatient = await updatePatientHistory(patientId, newTreatment);
    res.status(201).json({
      treatment: newTreatment,
      patient: updatedPatient,
    });
  } catch (error) {
    console.error("Ошибка добавления лечения:", error);
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
