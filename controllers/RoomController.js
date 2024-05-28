import { bookings, customers, rooms } from "../database/db.js";
import { areDatesEqual, isBetween, timeToMinutes } from "../helper.js";


//Create room controller
const createRoom = (req, res) => {
    const { numberOfSeatsAvailable, amenities, pricePerHour, roomName } = req.body;

    //If the fields are not available
    if (!numberOfSeatsAvailable || !amenities || !pricePerHour || !roomName) {
        res.status(404).json({
            status: 'Error',
            message: 'Error creating room!',
            data: {
                error: 'numberOfSeatsAvailable, amenities, pricePerHour, roomName is required!'
            }
        })
    }

    //Creating new room
    const newRoom = {
        id: rooms.length + 1,
        roomName: roomName,
        numberOfSeatsAvailable: numberOfSeatsAvailable,
        amenities: amenities,
        pricePerHour: pricePerHour
    }

    rooms.push(newRoom);
    res.status(201).json({
        status: 'Success',
        message: 'Room created successfully!',
        data: {
            createdRoom: newRoom
        }
    })

}


//Book room controller
const bookRoom = (req, res) => {
    let { customerId, date, startTime, endTime, roomId } = req.body;

    date = new Date(date);

    //If we don't have required payload
    if (!customerId || !date || !startTime || !endTime || !roomId) {
        res.status(404).json({
            status: 'Error',
            message: 'Error creating room!',
            data: {
                error: 'customerId, date, startTime, endTime, roomId is required!'
            }
        })
    }

    //Finding the room with roomId
    const room = rooms.find(room => room.id === roomId);

    //If the room was available
    if (room) {

        //If the room was available we need to check if the customer was available
        const customer = customers.findIndex(customer => customer.id === customerId);

        if (customer !== -1) {

            //Checking if start time is less than end time
            if (timeToMinutes(endTime) > timeToMinutes(startTime)) {
                //Handling customer can't book the already booked room with specific time slot
                let isbookingValidationfails = bookings.filter(booking => areDatesEqual(booking.date, date)).map(ele => {
                    return isBetween(startTime, ele.startTime, ele.endTime) || isBetween(endTime, ele.startTime, ele.endTime) || isBetween(ele.startTime, startTime, endTime) || isBetween(ele.endTime, startTime, endTime)
                })

                isbookingValidationfails = isbookingValidationfails.some(val => val === true)

                if (isbookingValidationfails) {
                    return res.status(404).json({
                        status: 'Error',
                        message: 'Error creating room!',
                        data: {
                            error: `Room ${room.roomName} with the selected time slot was already booked!. Please choose different time slot or select different date!`,
                        }
                    })
                }

                const newBooking = {
                    id: bookings.length + 1,
                    customerId: customerId,
                    date: date,
                    startTime: startTime,
                    endTime: endTime,
                    roomId: roomId,
                    bookingDate: new Date()
                }
                bookings.push(newBooking);
                res.status(201).json({
                    status: 'Sucess',
                    message: 'Room Booked successfully!',
                    data: {
                        room: {
                            ...newBooking,
                            roomDetails: rooms.find(room => room.id === roomId),
                            customerDetails: customers.find(customer => customer.id === customerId)
                        }
                    }
                })
            }
            else {
                return res.status(404).json({
                    status: 'Error',
                    message: 'Error creating room!',
                    data: {
                        error: `Start Time should be less than End Time!`,
                    }
                })
            }


        }

        //If the customer was not available
        else {
            res.status(404).json({
                status: 'Error',
                message: 'Error creating room!',
                data: {
                    error: `Customer with id ${customerId} was unavailable. Please choose any other customer or create one!`,
                    available_customers: customers
                }
            })
        }
    }

    //If the room was not available (i.e Not yet created)
    else {
        res.status(404).json({
            status: 'Error',
            message: 'Error creating room!',
            data: {
                error: `Room with id ${roomId} was unavailable. Please choose any other room!`,
                available_rooms: rooms
            }
        })
    }
}

//Getting all rooms controller
const allRooms = (_, res) => {

    let allRoomsWithBookings = [];

    for (let i = 0; i < rooms.length; i++) {
        let bookingsPerRoom = [];
        for (let j = 0; j < bookings.length; j++) {
            if (rooms[i].id === bookings[j].roomId) {
                let customer = customers.find(customer => customer.id === bookings[j].customerId);
                let booking = bookings[j];

                // Remove roomId and customerId from the combined object
                let { roomId, customerId, ...restOfBooking } = booking;
                let { ...restOfCustomer } = customer;

                bookingsPerRoom = [...bookingsPerRoom, { ...restOfCustomer, ...restOfBooking }];

            }
        }
        allRoomsWithBookings = [...allRoomsWithBookings, { ...rooms[i], booking_and_customer_details: bookingsPerRoom }];
    }

    res.status(200).json({
        status: "Success",
        message: "All Rooms fetched successfully!",
        data: {
            allRoomsWithBookings: allRoomsWithBookings
        }
    })
}

//Getting room by id controller
const roomById = (req, res) => {

    const { id } = req.params;

    //Finding the room with specified id
    const room = rooms.find(room => room.id == id);


    if (!room) {
        res.status(404).json({
            status: 'Error',
            message: 'Error fetching room!',
            data: {
                error: `Room with id ${id} was unavailable. Please choose any other room!`,
                available_rooms: rooms
            }
        })
    }

    //Bookings data with room
    const bookingDetails = bookings.filter(booking => booking.roomId === room.id);

    if(bookingDetails.length > 0) {
        let roomWithAllBookings = {}
        let bookingsPerRoom = [];
        for (let i = 0; i < bookingDetails.length; i++) {
            for (let j = 0; j < customers.length; j++) {
                if (bookingDetails[i].customerId === customers[j].id) {
                    let booking = bookings[i];
    
                    // Remove roomId and customerId from the combined object
                    let { roomId, customerId, ...restOfBooking } = booking;
                    let { ...restOfCustomer } = customers[j];
    
                    bookingsPerRoom = [...bookingsPerRoom, { ...restOfCustomer, ...restOfBooking }];
    
                }
            }
            roomWithAllBookings = { ...room, booking_and_customer_details: bookingsPerRoom }
        }
        res.status(200).json({
            status: "Success",
            message: `Room ${room.roomName} fetched successfully!`,
            data: {
                room: roomWithAllBookings
            }
        })
    }

    else {
        res.status(200).json({
            status: "Success",
            message: `Room ${room.roomName} fetched successfully!`,
            data: {
                room: {...room, booking_and_customer_details: "Not yet booked!"}
            }
        })
    }
    


    
}



export { createRoom, bookRoom, allRooms, roomById };