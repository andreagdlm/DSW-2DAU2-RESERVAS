const Booking = require('../models/Booking');
const Room = require('../models/Room');

const calculateTotalPrice = (room, startDate, endDate) => {
  const nights = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  let totalPrice = nights * room.pricePerNight;

  // APLICAR UN DESCUENTO DEL 10% SI LA RESERVA ES MAYOR A 7 NOCHES
  if (nights > 7) {
    totalPrice *= 0.9;
  }

  return { nights, totalPrice };
};

const bookingService = {
  // OBTENER RESERVAS ACTIVAS DE UN USUARIO
  getActiveBooking: async (userId) => {
    return await Booking.findOne({ customer: userId, status: "pending" }).populate('room');
  },

  // OBTENER HISTORIAL DE RESERVAS DE UN USUARIO
  getBookingHistory: async (userId) => {
    return await Booking.find({ customer: userId, status: { $ne: "pending" } }).populate('room');
  },

  // CREAR UNA NUEVA RESERVA
  createBooking: async (customerId, roomId, startDate, endDate) => {
    const room = await Room.findById(roomId);
    if (!room) throw new Error('La habitación no existe.');

    if (!room.availability) throw new Error('La habitación no está disponible.');

    const now = new Date();
    if (new Date(startDate) < now) throw new Error('La fecha de inicio debe ser igual o posterior a la fecha actual.');

    const overlappingBooking = await Booking.findOne({
      room: roomId,
      status: "pending",
      $or: [
        { startDate: { $lte: endDate, $gte: startDate } },
        { endDate: { $gte: startDate, $lte: endDate } },
        { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
      ]
    });

    if (overlappingBooking) throw new Error('Las fechas de la reserva se superponen con una reserva existente.');

    const { nights, totalPrice } = calculateTotalPrice(room, startDate, endDate);

    const newBooking = new Booking({
      customer: customerId,
      room: roomId,
      startDate,
      endDate,
      nights,
      totalPrice,
      status: "pending",
    });

    // MARCAR LA HABITACIÓN COMO NO DISPONIBLE
    room.availability = false;
    await room.save();

    return await newBooking.save();
  },

  // ACTUALIZAR FECHAS DE UNA RESERVA
  updateBookingDates: async (customerId, bookingId, newStartDate, newEndDate) => {
    const booking = await Booking.findOne({ _id: bookingId, customer: customerId, status: "pending" }).populate('room');
    if (!booking) throw new Error('Reserva no encontrada.');

    const now = new Date();
    if (new Date(newStartDate) < now) throw new Error('La fecha de inicio debe ser igual o posterior a la fecha actual.');

    const overlappingBooking = await Booking.findOne({
      room: booking.room._id,
      status: "pending",
      _id: { $ne: bookingId },
      $or: [
        { startDate: { $lte: newEndDate, $gte: newStartDate } },
        { endDate: { $gte: newStartDate, $lte: newEndDate } },
        { startDate: { $lte: newStartDate }, endDate: { $gte: newEndDate } }
      ]
    });

    if (overlappingBooking) throw new Error('Las fechas de la reserva se superponen con una reserva existente.');

    const { nights, totalPrice } = calculateTotalPrice(booking.room, newStartDate, newEndDate);

    booking.startDate = newStartDate;
    booking.endDate = newEndDate;
    booking.nights = nights;
    booking.totalPrice = totalPrice;

    return await booking.save();
  },

  // CANCELAR UNA RESERVA
  cancelBooking: async (customerId, bookingId) => {
    const booking = await Booking.findOne({ _id: bookingId, customer: customerId, status: "pending" });
    if (!booking) throw new Error('Reserva no encontrada.');

    const room = await Room.findById(booking.room);
    if (room) {
      room.availability = true; // MARCAR LA HABITACIÓN COMO DISPONIBLE
      await room.save();
    }

    booking.status = "cancelled";
    return await booking.save();
  },

  // CERRAR UNA RESERVA (FINALIZAR)
  closeBooking: async (customerId, bookingId) => {
    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, customer: customerId, status: "pending" },
      { status: "confirmed", endDate: new Date() },
      { new: true }
    );

    if (!booking) throw new Error('Reserva no encontrada.');

    const room = await Room.findById(booking.room);
    if (room) {
      room.availability = true; // LIBERAR LA HABITACIÓN
      await room.save();
    }

    return booking;
  },
};

module.exports = bookingService;