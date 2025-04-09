import { Router } from "express";
import { getAllRequests, createRequest } from "../db/queries.js";
import pool from "../db/pool.js";

const router = Router();

// Получение всех заявок
router.get("/", async (req, res) => {
  try {
    const requests = await getAllRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Создание новой заявки
router.post("/", async (req, res) => {
  try {
    const newRequest = await createRequest(req.body);
    res.json(newRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Изменение статуса заявки
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  try {
    const result = await pool.query(
      "UPDATE requests SET status = $1, reason = $2 WHERE id = $3 RETURNING *",
      [status, reason, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Заявка не найдена" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
