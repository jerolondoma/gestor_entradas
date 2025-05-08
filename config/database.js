const mysql = require('mysql2/promise');
require('dotenv').config();


const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'trabajo_eventos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initDb() {
  try {
    const connection = await pool.getConnection();

  
    await connection.query(`
      CREATE TABLE IF NOT EXISTS artistas (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          genero VARCHAR(50) NOT NULL,
          nacionalidad VARCHAR(50),
          descripcion TEXT
      )
  `);
  
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS organizadores (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          email VARCHAR(100)  NOT NULL,
          telefono VARCHAR(20),
          descripcion TEXT
      )
  `);
  

    await connection.query(`
      CREATE TABLE IF NOT EXISTS eventos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        fecha DATE NOT NULL,
        ubicacion VARCHAR(150),
        genero VARCHAR(50),
        artista_id INT NOT NULL,
        organizador_id INT NOT NULL, 
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (artista_id) REFERENCES artistas(id) ON DELETE CASCADE, 
        FOREIGN KEY (organizador_id) REFERENCES organizadores(id) ON DELETE CASCADE 
      )
    `);

await connection.query(`
  CREATE TABLE IF NOT EXISTS localidad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evento_id INT NOT NULL,
    nombre_localidad VARCHAR(100) NOT NULL,
    precio_localidad DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
  )
`);


await connection.query(`
  CREATE TABLE IF NOT EXISTS venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evento_id INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    localidad_id INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    cantidad_disponible INT NOT NULL DEFAULT 0,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE,
    FOREIGN KEY (localidad_id) REFERENCES localidad(id) ON DELETE CASCADE,
    UNIQUE (evento_id, localidad_id)
  )
`);




    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol ENUM('cliente', 'organizador', 'admin') DEFAULT 'cliente',
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);


    await connection.query(`
      CREATE TABLE IF NOT EXISTS compra (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        venta_id INT NOT NULL,
        nombre_usuario VARCHAR(100) NOT NULL,
        cantidad_comprada INT NOT NULL,
        fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (venta_id) REFERENCES venta(id) ON DELETE CASCADE
      )
    `);
    

    connection.release();
    console.log("Base de datos inicializada correctamente");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  }
}

initDb();

module.exports = pool;
