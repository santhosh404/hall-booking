import express from 'express';  
import { allCustomers, bookingCount, createCustomer } from '../controllers/CustomerController.js';

//Initializing router
export const CustomerRouter = express.Router();


CustomerRouter.post('/create-customer', createCustomer);
CustomerRouter.get('/all-customers', allCustomers);
CustomerRouter.get('/booking-count', bookingCount);