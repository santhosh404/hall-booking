import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { RoomRouter } from './routers/RoomRouter.js';
import { CustomerRouter } from './routers/CustomerRouter.js';

//Initializing the express
const app = express();

//configuring dotenv to access the .env variables
dotenv.config();

//Using cors middleware
app.use(cors());

//Using json middleware
app.use(express.json());

//Routers
app.use('/api/v1/room', RoomRouter);
app.use('/api/v1/customer', CustomerRouter);

const PORT = process.env.PORT || 5000

//Listening the server
app.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`)
})