import { createSlice } from "@reduxjs/toolkit";

export const booksSlice = createSlice({
  name: "books",
  initialState: [],
  reducers: {
    returnDataFromDb: (books, action) => {
      console.log(action.payload)
      books.push(...action.payload) ;
    },
    selectedCategory: (books, action) => {
      const payload = action.payload;
      const type = payload[0];
      console.log(type);

      switch (type) {
        case "all":
          return payload[1];
        case "spiritual":
          return payload[1]
        case "classic":
          return payload[1]
        case "inspirational":
          return payload[1]

        case "finance":
          return payload[1]
        default:
          payload[1];
          break;
      }
    },
    searchBooks: (books, action) => {
      const payload = action.payload;
      console.log(payload);
      return payload[1].filter(
        ({ title }) =>
          title
            .toLocaleLowerCase()
            .indexOf(payload[0].toLocaleLowerCase().trim()) !== -1
      );
    },
  },
});

export const {
  addBook,
  toggleRead,
  selectedCategory,
  searchBooks,
  returnDataFromDb,
} = booksSlice.actions;

export const selectBooks = (state) => state.books;

export default booksSlice.reducer;
