const { gql } = require("apollo-server");

const typeDefs = gql`
  type Room {
    _id: ID!
    name: String!
    type: String!
    pricePerNight: Float!
    features: [String!]!
    availability: Boolean!
  }

  type Query {
    rooms(type: String, minPrice: Float, maxPrice: Float): [Room]
  }

  type Mutation {
    createRoom(name: String!, type: String!, pricePerNight: Float!, features: [String!]!): Room
  }
`;

module.exports = typeDefs;