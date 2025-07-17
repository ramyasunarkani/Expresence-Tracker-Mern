const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config(); 
require('./utils/db-connection'); 

app.use(express.json()); 
app.use(cors());

const authRouter = require('./routes/AuthRoutes'); 
const ProductRouter = require('./routes/ProductRouter');
const transactionRouter = require('./routes/transactionRoutes'); 

app.get('/', (req, res) => {
    res.send('API is running');
});


app.use('/api', authRouter);
app.use('/products', ProductRouter);
app.use('/api', transactionRouter);

const PP =  4000|| process.env.PORT;

app.listen(PP, () => {
    console.log(`Server running at PORT ${PP}`);
});


