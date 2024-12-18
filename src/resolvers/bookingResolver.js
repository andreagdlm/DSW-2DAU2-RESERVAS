const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Customer = require("../models/Customer");
const bookingService = require("../services/bookingService");

module.exports = {
  Query: {
    bookings: async (_, { status }) => {
      const query = status ? { status } : {};
      return await Booking.find(query).populate("customer room");
    },
  },
  Mutation: {
    createBooking: async (_, { customerId, roomId, startDate, endDate }) => {
      return await bookingService.createBooking(customerId, roomId, startDate, endDate);
    },
    updateBooking: async (_, { bookingId, status }) => {
      const booking = await Booking.findById(bookingId).populate("room");
      booking.status = status;

      if (status === "cancelled") {
        booking.room.availability = true;
        await booking.room.save();
      }

      return await booking.save();
    },
    deleteBooking: async (_, { bookingId }) => {
      const booking = await Booking.findById(bookingId).populate("room");
      if (!booking) return false;

      booking.room.availability = true;
      await booking.room.save();
      await Booking.deleteOne({ _id: bookingId });
      return true;
    },
  },
  Booking: {
    customer: async (booking) => {
      return await Customer.findById(booking.customer);
    },
    room: async (booking) => {
      return await Room.findById(booking.room);
    },
  },
};

// const Booking = require("../models/Booking");
// const Room = require("../models/Room");

// module.exports = {
//   Query: {
//     bookings: async (_, { status }) => {
//       const query = status ? { status } : {};
//       return await Booking.find(query).populate("customer room");
//     },
//   },
//   Mutation: {
//     createBooking: async (_, { customerId, roomId, startDate, endDate }) => {
//       const room = await Room.findById(roomId);
//       if (!room || !room.availability) throw new Error("Room not available");

//       const nights = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
//       const totalPrice = nights * room.pricePerNight;

//       const booking = new Booking({
//         customer: customerId,
//         room: roomId,
//         startDate,
//         endDate,
//         nights,
//         totalPrice,
//         status: "pending",
//       });

//       room.availability = false;
//       await room.save();
//       return await booking.save();
//     },
//     updateBooking: async (_, { bookingId, status }) => {
//       const booking = await Booking.findById(bookingId).populate("room");
//       booking.status = status;

//       if (status === "cancelled") {
//         booking.room.availability = true;
//         await booking.room.save();
//       }

//       return await booking.save();
//     },
//     deleteBooking: async (_, { bookingId }) => {
//       const booking = await Booking.findById(bookingId).populate("room");
//       if (!booking) return false;

//       booking.room.availability = true;
//       await booking.room.save();
//       await Booking.deleteOne({ _id: bookingId });
//       return true;
//     },
//   },
// };
