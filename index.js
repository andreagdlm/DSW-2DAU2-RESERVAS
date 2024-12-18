const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const roomTypeDefs = require("./src/schemas/roomSchema");
const customerTypeDefs = require("./src/schemas/customerSchema");
const bookingTypeDefs = require("./src/schemas/bookingSchema");

const roomResolver = require("./src/resolvers/roomResolver");
const customerResolver = require("./src/resolvers/customerResolver");
const bookingResolver = require("./src/resolvers/bookingResolver");

const startServer = async () => {
    
    await mongoose.connect('mongodb+srv://andreagdlm:Progratec3007@segundadsw.uap4m.mongodb.net/');
    
    const server = new ApolloServer({
        typeDefs: [roomTypeDefs, customerTypeDefs, bookingTypeDefs],
        resolvers: [roomResolver, customerResolver, bookingResolver],
      });
      
    server.listen().then(({ url }) => {
      console.log(`Servidor corriendo en ${url}`);
    });
  };

startServer();