import { Router } from "express";
import bcrypt from "bcrypt";
import { registerDoctor, findDoctorByUsername } from "../db/queries.js";
const router = Router();

// Регистрация врача
router.post("/register", async (req, res) => {
  const { name, phone, email, username, password } = req.body;

  try {
    const existingDoctor = await findDoctorByUsername(username);
    if (existingDoctor) {
      return res
        .status(400)
        .json({ message: "Врач с таким логином уже существует" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doctor = await registerDoctor({
      name,
      phone,
      email,
      username,
      passwordHash,
    });

    res.status(201).json({ doctor });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
});

// Авторизация врача
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const doctor = await findDoctorByUsername(username);

    if (!doctor) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    res.json({
      message: "Авторизация успешна",
      doctor: {
        id: doctor.id,
        username: doctor.username,
        role: doctor.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
});

export default router;
