  const express = require('express');
  const path = require('path');
  const bodyParser = require('body-parser');
  const pg = require('pg');

  const app = express();
  const port = 3000;

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'user',
    password: '123',
    port: 5432,
  });

  // Obtener todos los artículos
  app.get('/articulos', (req, res) => {
    pool.query('SELECT * FROM articulos', (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    });
  });

  // Crear un artículo
  app.post('/articulos', (req, res) => {
    const { nombre, cantidad, ubicacion, precio1, precio2, precio3 } = req.body;

    pool.query('INSERT INTO articulos (nombre, cantidad, ubicacion, precio1, precio2, precio3) VALUES ($1, $2, $3, $4, $5, $6)',
        [nombre, cantidad, ubicacion, precio1, precio2, precio3], (error) => {
            if (error) {
                throw error;
            }
            res.status(201).send('Artículo creado correctamente');
        });
});


  // Obtener un artículo por ID
  app.get('/articulos/:id', (req, res) => {
    const id = req.params.id;
    pool.query('SELECT * FROM articulos WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    });
  });

  // Actualizar un artículo por ID
  app.put('/articulos/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, cantidad, ubicacion, precio1, precio2, precio3 } = req.body;

    pool.query('UPDATE articulos SET nombre = $1, cantidad = $2, ubicacion = $3, precio1 = $4, precio2 = $5, precio3 = $6 WHERE id = $7',
        [nombre, cantidad, ubicacion, precio1, precio2, precio3, id], (error) => {
            if (error) {
                throw error;
            }
            res.status(200).send('Artículo actualizado correctamente');
        });
});

  

  // Eliminar un artículo por ID
  app.delete('/articulos/:id', (req, res) => {
    const id = req.params.id;
    pool.query('DELETE FROM articulos WHERE id = $1', [id], (error) => {
      if (error) {
        throw error;
      }
      res.status(200).send('Artículo eliminado correctamente');
    });
  });

  app.post('/register', (req, res) => {
    const { username, password } = req.body;
  
    // Verificar si el nombre de usuario ya existe en la base de datos
    pool.query('SELECT * FROM users WHERE username = $1', [username], (error, results) => {
      if (error) {
        console.error('Error al verificar el nombre de usuario:', error);
        return res.status(500).send('<script>alert("Error al verificar el nombre de usuario."); window.location="/registro.html";</script>');
      }
  
      if (results.rows.length > 0) {
        return res.status(400).send('<script>alert("El nombre de usuario ya está en uso. Por favor, elige otro."); window.location="/registro.html";</script>');
      }
  
      // El nombre de usuario no está en uso, insertar el nuevo usuario en la base de datos
      pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password], (error) => {
        if (error) {
          console.error('Error al registrar el usuario:', error);
          return res.status(500).send('<script>alert("Error al registrar el usuario."); window.location="/registro.html";</script>');
        }
        res.redirect('/index.html');
      });
    });
  });
  
  
  
  // Ruta para iniciar sesión
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    pool.query('SELECT * FROM users WHERE username = $1', [username], (error, results) => {
      if (error) {
        throw error;
      }
  
      if (results.rows.length === 0) {
        res.send('<script>alert("Usuario o contraseña incorrecto"); window.location="/index.html";</script>');
      } else {
        const storedPassword = results.rows[0].password;
  
        if (password === storedPassword) {
          res.redirect('/articulos.html');
        } else {
          res.send('<script>alert("Usuario o contraseña incorrecto"); window.location="/index.html";</script>');
        }
      }
    });
  });

  app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
  });
