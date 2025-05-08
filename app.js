const express = require('express'); 
const app = express(); 
const eventoRoutes = require('./routes/eventoRoutes'); 
const artistaRoutes = require('./routes/artistaRoutes'); 
const organizadorRoutes = require('./routes/organizadorRoutes'); 
const usuarioRoutes = require('./routes/usuarioRoutes'); 
const localidadRoutes = require('./routes/localidadRoutes');
const ventaRoutes = require('./routes/ventaRoutes');
const compraRoutes = require('./routes/compraRoutes');


require('dotenv').config(); 
const pool = require('./config/database'); 

app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 

app.use('/api', eventoRoutes); 
app.use('/api', artistaRoutes); 
app.use('/api', organizadorRoutes); 
app.use('/api', usuarioRoutes); 
app.use('/api', localidadRoutes);
app.use('/api', ventaRoutes);
app.use('/api', compraRoutes);

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => { console.log(`Servidor corriendo en el puerto ${PORT}`); });