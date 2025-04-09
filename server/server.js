import express from "express";
import { config } from "dotenv";
import doctorsRouter from "./routes/doctors.js";
import patientsRouter from "./routes/patients.js";
import treatmentsRouter from "./routes/treatments.js";

config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// API Routes
app.use("/api/doctors", doctorsRouter);
app.use("/api/patients", patientsRouter);
app.use("/api/treatments", treatmentsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
