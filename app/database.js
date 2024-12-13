const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'musicas_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function query(sql, params) {
    try {
        const [results] = await connection.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Erro na consulta SQL:', error);
        throw error;
    }
}

module.exports = {
    query,
    connection
}; 