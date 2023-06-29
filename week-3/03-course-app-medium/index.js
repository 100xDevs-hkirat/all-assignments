const express = require('express');
const app = express();
const adminRoutes = require('./src/routes/adminRoutes');
const userRoutes = require('./src/routes/userRoutes');

app.use(express.json());

app.use('/admin', adminRoutes);
app.use('/users', userRoutes);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
