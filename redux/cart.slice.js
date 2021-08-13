import { createSlice } from '@reduxjs/toolkit';
const fetch = require("node-fetch");

const cartSlice = createSlice({
    name: 'cart',
    initialState: [ ],
    reducers: {
      addToCart: (state, action) => {
        fetch("http://localhost:8080/api/products",  // TODO: rename
            {
              method: "POST",
              body: JSON.stringify(action.payload),
              headers: { 'Content-Type': 'application/json'}
            });
        const itemExists = state.find((item) => item.id === action.payload.id);
        if (itemExists) {
          itemExists.quantity++;
        } else {
          state.push({ ...action.payload, quantity: 1 });
        }
      },
      incrementQuantity: (state, action) => {
        // TODO: POST
        const item = state.find((item) => item.id === action.payload);
        item.quantity++;
      },
      decrementQuantity: (state, action) => {
        // TODO: POST
        const item = state.find((item) => item.id === action.payload);
        if (item.quantity === 1) {
          const index = state.findIndex((item) => item.id === action.payload);
          state.splice(index, 1);
        } else {
          item.quantity--;
        }
      },
      removeFromCart: (state, action) => {
        // TODO: POST
        const index = state.findIndex((item) => item.id === action.payload);
        state.splice(index, 1);
      },
    },
});

export const cartReducer = cartSlice.reducer;

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} = cartSlice.actions;