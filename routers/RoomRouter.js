import express from 'express';  
import { allRooms, bookRoom, createRoom, roomById } from '../controllers/RoomController.js';

//Initializing router
export const RoomRouter = express.Router();


RoomRouter.post('/create-room', createRoom);
RoomRouter.post('/book-room', bookRoom);
RoomRouter.get('/all-rooms', allRooms);
RoomRouter.get('/get-room/:id', roomById);