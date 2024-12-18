const Room = require("../models/Room");

module.exports = {
  Query: {
    rooms: async (_, { type, minPrice, maxPrice }) => {
      const query = {};
      if (type) query.type = type;
      if (minPrice) query.pricePerNight = { $gte: minPrice };
      if (maxPrice) query.pricePerNight = { ...query.pricePerNight, $lte: maxPrice };
      return await Room.find(query);
    },
  },
  Mutation: {
    createRoom: async (_, { name, type, pricePerNight, features }) => {
      const room = new Room({ name, type, pricePerNight, features });
      return await room.save();
    },
  },
};
