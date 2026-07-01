import { db } from "../config/db";

export const checkUserByPhone = async (phone: string) => {
  const [rows]: any = await db.query("SELECT * FROM users WHERE phone = ?", [
    phone,
  ]);

  return rows[0] || null;
};

export const createUser = async (
  firebase_uid: string,
  phone: string,
  name: string,
  email: string,
  role: string,
) => {
  const [result]: any = await db.query(
    `
    INSERT INTO users
    (firebase_uid, phone, name, email, role)
    VALUES (?, ?, ?, ?, ?)
    `,
    [firebase_uid, phone, name, email, role],
  );

  const [users]: any = await db.query(
    `
    SELECT *
    FROM users
    WHERE id = ?
    `,
    [result.insertId],
  );

  return users[0];
};
