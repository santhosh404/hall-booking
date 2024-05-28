import { bookings, customers, rooms } from "../database/db.js";


//Create customer controller
const createCustomer = (req, res) => {
    const { customerName, customerPhoneNumber } = req.body;

    if (!customerName || !customerPhoneNumber) {
        res.status(404).json({
            status: "Error",
            message: "Error creating customer!",
            data: {
                error: "customerName, customerPhoneNumber are required!"
            }
        })
    }

    const newCustomer = {
        id: customers.length + 1,
        customerName: customerName,
        customerPhoneNumber: customerPhoneNumber
    }
    customers.push(newCustomer);
    res.status(201).json({
        status: 'Success',
        message: 'Customer created successfully',
        data: {
            newCustomer: newCustomer
        }
    })
}

//Getting all customer controller
const allCustomers = (req, res) => {

    let customerWithRoomDetails = [];

    for(let i = 0; i < customers.length; i++) {
        let roomsPerCustomer = [];
        for(let j = 0; j < bookings.length; j++) {
            if(customers[i].id === bookings[j].customerId) {
                let room = rooms.find(room => room.id === bookings[j].roomId);
                let booking = bookings[j];

                // Remove roomId and customerId from the combined object
                let { roomId, customerId, ...restOfBooking } = booking;
                let { ...restOfRoom } = room;

                roomsPerCustomer = [...roomsPerCustomer, { ...restOfRoom, ...restOfBooking }];
            }
        }
        customerWithRoomDetails = [...customerWithRoomDetails, { ...customers[i], room_details: roomsPerCustomer }];
    }

    res.status(200).json({
        status: "Success",
        message: "Customers fetched successfully!",
        data: {
            customersWithRoomDetails: customerWithRoomDetails
        }
    })

}

//Finding how many times a customer booked a room
const bookingCount = (req, res) => {

    let customerWithRoomDetails = [];

    for(let i = 0; i < customers.length; i++) {
        let roomsPerCustomer = [];
        for(let j = 0; j < bookings.length; j++) {
            if(customers[i].id === bookings[j].customerId) {
                let room = rooms.find(room => room.id === bookings[j].roomId);
                let booking = bookings[j];

                // Remove roomId and customerId from the combined object
                let { roomId, customerId, ...restOfBooking } = booking;
                let { ...restOfRoom } = room;

                roomsPerCustomer = [...roomsPerCustomer, { ...restOfRoom, ...restOfBooking }];
            }
        }
        customerWithRoomDetails = [...customerWithRoomDetails, { ...customers[i], number_of_times_booked: roomsPerCustomer.length, room_details: roomsPerCustomer }];
    }

    res.status(200).json({
        status: "Success",
        message: "Customers fetched successfully!",
        data: {
            customersWithRoomDetails: customerWithRoomDetails
        }
    })

}


export { createCustomer, allCustomers, bookingCount }