import pool from "./pool.js";

// Получение всех заявок
const getAllRequests = async () => {
  const result = await pool.query(
    `SELECT 
       id, 
       address, 
       contact, 
       to_char(date_time, 'YYYY-MM-DD HH24:MI:SS') AS "date_time", 
       service, 
       payment_type AS "payment_type", 
       status 
     FROM requests 
     ORDER BY created_at DESC`
  );
  return result.rows;
};

// Создание новой заявки
const createRequest = async (data) => {
  const { address, contact, dateTime, service, paymentType } = data;

  const result = await pool.query(
    `INSERT INTO requests (address, contact, date_time, service, payment_type, status)
       VALUES ($1, $2, $3::timestamp, $4, $5, 'ожидает') RETURNING *`,
    [address, contact, dateTime, service, paymentType]
  );

  return result.rows[0];
};

// Регистрация нового пользователя
const registerUser = async (userData) => {
  const { name, phone, email, username, passwordHash } = userData;

  const result = await pool.query(
    `INSERT INTO users (name, phone, email, username, password_hash)
     VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, username, created_at`,
    [name, phone, email, username, passwordHash]
  );

  return result.rows[0];
};

// Поиск пользователя по логину
const findUserByUsername = async (username) => {
  const result = await pool.query(
    `SELECT id, username, password_hash, role FROM users WHERE username = $1`,
    [username]
  );
  return result.rows[0];
};

export { getAllRequests, createRequest, registerUser, findUserByUsername };
