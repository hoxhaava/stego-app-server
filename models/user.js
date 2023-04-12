const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'steg',
    password: 'steg',
    database: 'steg_app_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 3307
});

const SALT_ROUNDS = 10;

const User = {};

User.create = async (name, email, password, authToken) => {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const connection = await pool.getConnection();

    const [rows, fields] = await connection.execute(
        'INSERT INTO users (name, email, password, auth_token) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, authToken]
    );

    connection.release();

    const id = rows.insertId;

    return { id, name, email, hashedPassword, authToken };
};

User.getAll = async () => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.execute(
        'SELECT * FROM users'
    );

    connection.release();

    return rows;
};

User.findByEmail = async (email) => {
    const connection = await pool.getConnection();

    const [rows] = await connection.query(
        'SELECT * FROM users WHERE email = ? LIMIT 1',
        [email]
    );

    connection.release();

    return rows[0] || null;
};

User.findById = async (userId) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [userId]
    );

    connection.release();

    if (rows.length === 0) {
        return null;
    }

    const user = rows[0];
    return { id: user.id, email: user.email, authToken: user.auth_token };
};

User.deleteToken = async (userId) => {
    const connection = await pool.getConnection();
    const [rows, fields] = await connection.execute(
        'UPDATE users SET auth_token = NULL WHERE id = ?', [userId || null]
    );
    connection.release();
};


User.updateAuthToken = async (id, token) => {
    const connection = await pool.getConnection();

    const [rows, fields] = await connection.execute(
        'UPDATE users SET auth_token = ? WHERE id = ?',
        [token, id]
    );

    connection.release();

    return rows.affectedRows === 1;
};

module.exports = User;