import express from 'express';

const app = express();
const router = require('./Routes/serverRoutes');

app.use(express.static('public'));

app.use('/', router);
app.use('/about', router);

app.listen(3000);
