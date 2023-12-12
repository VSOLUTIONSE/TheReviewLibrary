import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './booksSlice.js';
import notesReducer from './notesSlice.js';
import usersReducer from './usersSlice.js';
import bookReducer from './bookSlice.js';

export default configureStore({
  reducer: {
    books: booksReducer,
    notes: notesReducer,
    users: usersReducer,
    book: bookReducer
  }
})