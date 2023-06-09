const { MenuItem, Order, Review, User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');


const resolvers = {
    //define resolvers for queries
    Query: {
      //get all menu items  
      menuItems: async () => {
        return await MenuItem.find();
      },
      //get menu item by id
      menuItem: async (_, { id }) => {
        return await MenuItem.findById(id);
      },
      //get all reviews
      reviews: async () => {
        return await Review.find();
      },
      //get review by id
      // review: async (_, { id }) => {
      //   return await Review.findById(id);
      // },
    },
    //define resolvers for mutations
    Mutation: {
      //create menu item  
      createMenuItem: async (_, { name, description, price, image}) => {
        const menuItem = await MenuItem.create({name, description, price, image});
        return menuItem;
      },
      //update menu item
      updateMenuItem: async (_, { _id, name, description, price, image }) => {
        const menuItem = await MenuItem.findById(_id);
        menuItem.set({name, description, price, image});
        await menuItem.save();
        return menuItem;
      },
      //delete menu item by id
      deleteMenuItem: async (_, { _id }) => {
        const menuItem = await MenuItem.findByIdAndDelete(_id);
        return menuItem;
      },
      //create review
      createReview: async (_, { name, comment }) => {
        const review = await Review.create({name, comment});
        return review;
      },
      //delete review by id
      deleteReview: async (_, { id }) => {
        const review = await Review.findByIdAndDelete(id);
        return review;
      },
      // create order
      createOrder: async (_, { customerName, customerEmail, items, total }) => {
        const order = await Order.create({ customerName, customerEmail, items, total });
        return order;
      },
      // delete order by id
      deleteOrder: async (_, { _id }) => {
        const order = await Order.findByIdAndDelete(_id);
        return order;
      },
      login: async (_parent, { email, password }) => {
        const user = await User.findOne({ email });
  
        if (!user) {
            throw new AuthenticationError('User not found.');
        }
  
        const pwd = await user.isCorrectPassword(password);
  
        if (!pwd) {
            throw new AuthenticationError('Wrong Password!');
        }
  
        const token = signToken(user);
        return { token, user };
    },
    },
    
  

  };
  

module.exports = resolvers;
