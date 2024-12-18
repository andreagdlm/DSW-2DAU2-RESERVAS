const Customer = require("../models/Customer");

module.exports = {
  Query: {
    customers: async () => await Customer.find(),
  },
  Mutation: {
    createCustomer: async (_, { name, email, phone }) => {
      const customer = new Customer({ name, email, phone });
      return await customer.save();
    },
  },
};
