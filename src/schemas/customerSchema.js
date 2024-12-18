const { gql } = require("apollo-server");

const typeDefs = gql`
  type Customer {
    _id: ID!
    name: String!
    email: String!
    phone: String!
  }

  type Query {
    customers: [Customer]
  }

  type Mutation {
    createCustomer(name: String!, email: String!, phone: String!): Customer
  }
`;

module.exports = typeDefs;