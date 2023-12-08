import { useParams, Link, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config.js";
import Notes from "../components/Notes.jsx";
import { useSelector, useDispatch } from "react-redux";
import {
  selectBooks,
  toggleRead,
  returnDataFromDb,
} from "../store/booksSlice.js";
import Header from "../components/Header.jsx";
// import {eraseBookNotes} from '../store/notesSlice.js';
import { useEffect } from "react";
import { Circle, Ellipsis } from "react-css-spinners";

function SingleBookPage() {
  const dispatch2 = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const populateBookSlice = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Books"));
        const database = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        dispatch2(returnDataFromDb(database));
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };
  
    populateBookSlice();
  }, []);
  
  const { id } = useParams();

  const data = useSelector(selectBooks);

  const book = data.filter((book) => book.id == id)[0];
  // console.log(data);

  return (
    <>
      <Header />
      <div className="container">
        <Link to="/">
          <button className="btn">← Back to Books</button>
        </Link>

        {book ? (
          <div className="single-book">
            <div className="book-cover">
              <img src={book.cover} />
            </div>

            <div className="book-details">
              <h3 className="book-title">{book.title}</h3>
              <h4 className="book-author">{book.author}</h4>
              <p>{book.review}</p>
              <div className="read-checkbox"></div>
            </div>

            <Notes bookId={id} />
          </div>
        ) : (
          <div className="css-spinners">
            <Ellipsis color="#0d1f41" />
          </div>
        )}
      </div>
    </>
  );
}

export default SingleBookPage;
