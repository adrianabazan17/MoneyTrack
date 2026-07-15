const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const movimientoRoutes = require('./routes/movimiento.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const reporteRoutes = require('./routes/reporte.routes');
const objetivoRoutes = require('./routes/objetivo.routes');
const verificarToken = require('./middlewares/auth.middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {

    res.json({
        success: true,
        message: 'API MoneyTrack funcionando correctamente.'
    });

});

app.use('/api/auth', authRoutes);

app.use('/api/categorias', categoriaRoutes);

app.use('/api/movimientos', movimientoRoutes);

app.use('/api/dashboard', dashboardRoutes);

app.use('/api/reportes', reporteRoutes);

app.use('/api/objetivos', objetivoRoutes);

app.get('/api/perfil', verificarToken, (req, res) => {

    res.json({
        success: true,
        usuario: req.usuario
    });

});

module.exports = app;