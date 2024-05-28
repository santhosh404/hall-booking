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
app.use('/api/v1/customer', CustomerRouter)

//Listening the server
app.listen(process.env.PORT, () => {
    console.log(`Server is up and running at ${process.env.PORT}`)
})