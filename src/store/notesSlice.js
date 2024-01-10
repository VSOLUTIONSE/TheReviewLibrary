import { RouteSharp } from "@mui/icons-material";
import { createSlice } from "@reduxjs/toolkit";

export const notesSlice = createSlice({
  name: "notes",
  initialState: [],
  reducers: {
    addComment: (notes, action) => {
      let newNote = action.payload;
      // newNote.id = notes.length
      //   ? Math.max(...notes.map((note) => note.id)) + 1
      //   : 1;
      notes.unshift(newNote); 
    },
    returnFromDb: (notes, action) => {
      // console.log(action.payload)
      notes.push(...action.payload)
    },
    eraseNote: (notes, action) => {
      return notes.filter((note) => note.id != action.payload);
    },
    liked: (notes, action) => {
      let noteWithId = notes.find((note) => note.id === action.payload);
//       let Bolean = noteWithId.isLiked;
// console.log(Bolean)
//       noteWithId.isLiked = !Bolean;
      noteWithId.likes = noteWithId.likes + 1;
    },
    unLiked: (notes, action) => {
      let noteWithId = notes.find((note) => note.id === action.payload);

      // let Bolean = noteWithId.isLiked;

      // noteWithId.isLiked = !Bolean;

      noteWithId.likes = noteWithId.likes - 1;
    },
    
  },
});

export const { addComment, returnFromDb, eraseNote, unLiked, liked } =
  notesSlice.actions;

export const selectNotes = (state) => state.notes;

export default notesSlice.reducer;
