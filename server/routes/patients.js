import { Router } from "express";
import {
  getAllPatients,
  createPatient,
  getPatientById,
  updatePatient,
  getPatientHistory,
} from "../db/queries.js";

const router = Router();

// Получение всех пациентов
router.get("/", async (req, res) => {
  try {
    const patients = await getAllPatients();
    res.json(patients.map((patient) => ({ ...patient, id: patient.id })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Создание нового пациента
router.post("/", async (req, res) => {
  try {
    const newPatient = await createPatient(req.body);
    res.status(201).json({ ...newPatient, id: newPatient.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получение информации о пациенте по ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await getPatientById(id);
    if (!patient) {
      return res.status(404).json({ error: "Пациент не найден" });
    }
    res.json({ ...patient, id: patient.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обновление данных пациента
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPatient = await updatePatient(id, req.body);
    res.json({ ...updatedPatient, id: updatedPatient.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получение истории лечения пациента
router.get("/:id/history", async (req, res) => {
  const { id } = req.params;
  try {
    const history = await getPatientHistory(id);
    if (history.length === 0) {
      return res.status(404).json({ error: "История лечения не найдена" });
    }
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const { patientId, medications, treatmentDate, description } = req.body;

  try {
    const newTreatment = await createTreatment({
      patientId,
      medications,
      treatmentDate,
      description,
    });

    const updatedHistory = await updatePatientHistory(patientId, newTreatment);

    res.status(201).json({
      treatment: newTreatment,
      patientHistory: updatedHistory,
    });
  } catch (error) {
    console.error("Ошибка добавления лечения:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
