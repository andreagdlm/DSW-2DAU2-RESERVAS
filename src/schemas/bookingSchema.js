const { gql } = require("apollo-server");

const typeDefs = gql`
  type Booking {
    _id: ID!
    customer: Customer!
    room: Room!
    startDate: String!
    endDate: String!
    nights: Int!
    totalPrice: Float!
    status: String!
  }

  type Query {
    bookings(status: String): [Booking]
  }

  type Mutation {
    createBooking(customerId: ID!, roomId: ID!, startDate: String!, endDate: String!): Booking
    updateBooking(bookingId: ID!, status: String!): Booking
    deleteBooking(bookingId: ID!): Boolean
  }
`;

module.exports = typeDefs;