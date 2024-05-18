const express = require('express');
const session = require('express-session');

const app = express();
app.use(express.urlencoded({ extended: true })); // Para manejar datos de formularios
app.use(express.static('public')); // Servir contenido estático desde 'public'
app.use(
  session({
    secret: 'mi_secreto_seguro', // Cambia esto por un secreto seguro
    resave: false,
    saveUninitialized: false,
  })
);

// Página de inicio de sesión
app.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect('/index'); // Si el usuario está autenticado, redirigir a la página principal
  }

  res.sendFile(__dirname + 'login.html'); // Enviar el archivo HTML del formulario de inicio de sesión
});

// Procesar el inicio de sesión
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verifica las credenciales principales (usuario y contraseña)
  if (username === 'admin' && password === 'admin') {
    req.session.loggedIn = true; // Marca al usuario como autenticado
    return res.redirect('/index'); // Redirigir a la página principal
  }

  res.send('Usuario o contraseña incorrectos. <a href="/login">Intenta de nuevo</a>');
});

// Página principal después del inicio de sesión
app.get('/index', (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect('/login'); // Si no está autenticado, redirigir al inicio de sesión
  }

  res.sendFile(__dirname + '/public/index.html'); // Enviar el archivo HTML de la página principal
});

// Cerrar sesión
app.get('/logout', (req, res) => {
  req.session.destroy(); // Destruir la sesión para cerrar sesión
  res.redirect('/login'); // Redirigir a la página de inicio de sesión
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
