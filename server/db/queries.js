import pool from "./pool.js";

// Получение всех пациентов
const getAllPatients = async () => {
  const result = await pool.query(
    `SELECT 
       id, 
       name, 
       phone, 
       email, 
       diagnosis, 
       to_char(date_of_birth, 'YYYY-MM-DD') AS "date_of_birth", 
       created_at
     FROM patients
     ORDER BY created_at DESC`
  );
  return result.rows;
};

// Создание нового пациента
const createPatient = async (data) => {
  const { name, phone, email, diagnosis, dateOfBirth } = data;

  const result = await pool.query(
    `INSERT INTO patients (name, phone, email, diagnosis, date_of_birth)
       VALUES ($1, $2, $3, $4, $5::date) RETURNING *`,
    [name, phone, email, diagnosis, dateOfBirth]
  );

  return result.rows[0];
};

// Получение информации о пациенте по id
const getPatientById = async (patientId) => {
  const result = await pool.query(
    `SELECT 
       id, 
       name, 
       phone, 
       email, 
       diagnosis, 
       to_char(date_of_birth, 'YYYY-MM-DD') AS "date_of_birth", 
       created_at
     FROM patients
     WHERE id = $1`,
    [patientId]
  );
  return result.rows[0];
};

// Обновление данных пациента
const updatePatient = async (patientId, data) => {
  const { name, phone, email, diagnosis, dateOfBirth } = data;

  const result = await pool.query(
    `UPDATE patients
     SET name = $1, phone = $2, email = $3, diagnosis = $4, date_of_birth = $5::date
     WHERE id = $6
     RETURNING *`,
    [name, phone, email, diagnosis, dateOfBirth, patientId]
  );

  return result.rows[0];
};

// Получение истории лечения пациента
const getPatientHistory = async (patientId) => {
  const result = await pool.query(
    `SELECT 
       t.id AS treatment_id,
       t.medications, 
       to_char(t.date_of_treatment, 'YYYY-MM-DD') AS "date_of_treatment",
       t.description AS treatment_description
     FROM treatments t
     WHERE t.patient_id = $1
     ORDER BY t.date_of_treatment DESC`,
    [patientId]
  );
  return result.rows;
};

// Добавление нового лечения для пациента
const createTreatment = async (data) => {
  const { patientId, medications, dateOfTreatment, description } = data;

  const result = await pool.query(
    `INSERT INTO treatments (patient_id, medications, date_of_treatment, description)
       VALUES ($1, $2, $3::date, $4) RETURNING *`,
    [patientId, medications, dateOfTreatment, description]
  );

  return result.rows[0];
};

// Функция для получения лечения по ID
export const getTreatmentById = async (id) => {
  const result = await pool.query("SELECT * FROM treatments WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
};

// Регистрация нового врача
const registerDoctor = async (doctorData) => {
  const { name, phone, email, username, passwordHash } = doctorData;

  const result = await pool.query(
    `INSERT INTO doctors (name, phone, email, username, password_hash)
     VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, username, created_at`,
    [name, phone, email, username, passwordHash]
  );

  return result.rows[0];
};

// Поиск врача по логину
const findDoctorByUsername = async (username) => {
  const result = await pool.query(
    `SELECT id, username, password_hash, role FROM doctors WHERE username = $1`,
    [username]
  );
  return result.rows[0];
};

export {
  getAllPatients,
  createPatient,
  getPatientById,
  updatePatient,
  getPatientHistory,
  createTreatment,
  registerDoctor,
  findDoctorByUsername,
};
