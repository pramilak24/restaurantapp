const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Import Routes
const tablesRoutes = require('./routes/tables');
const menuRoutes = require('./routes/menu');
const ordersRoutes = require('./routes/orders');
const registerRoutes = require('./routes/register'); 
const loginRoutes = require('./routes/login'); 
const reservationsRoutes = require('./routes/reservations'); 
const billingRoutes = require('./routes/billing'); // Adjust the path

// Use Routes
app.use('/tables', tablesRoutes);
app.use('/menu', menuRoutes);
app.use('/orders', ordersRoutes);
app.use('/register', registerRoutes);
app.use('/login', loginRoutes); 
app.use('/reservations', reservationsRoutes); 
app.use('/billing', billingRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
