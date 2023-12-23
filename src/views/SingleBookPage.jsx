import { useParams, Link, useNavigate } from "react-router-dom";
import { collection, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config.js";
import Notes from "../components/Notes.jsx";
import { useSelector, useDispatch } from "react-redux";
import {
  selectBooks,
  toggleRead,
  returnDataFromDb,
} from "../store/booksSlice.js";

import { selectbook, book } from "../store/bookSlice.js";
import Header from "../components/Header.jsx";
// import {eraseBookNotes} from '../store/notesSlice.js';
import { useEffect } from "react";
import { Circle, Ellipsis } from "react-css-spinners";
import { Divider } from "@mui/material";

function SingleBookPage() {
  const dispatch2 = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const data = useSelector(selectbook);

  // const bookwithId = data.filter((book) => book.id == id)[0];

  useEffect(() => {
    const populateBookSlice = async () => {
      try {
        const docRef = doc(db, "Books", id);
        const docSnap = await getDoc(docRef);
        const BookWithId = {
          id: docSnap.id,
          ...docSnap.data()
        }
        dispatch2(book(BookWithId));
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };

    populateBookSlice();
  }, []);

  console.log(data);

  return (
    <>
      <Header />
      <div className="container">
        <Link to="/">
          <button className="btn">← Back to Books</button>
        </Link>

        {data ? (
          <div className="single-book">
            <div className="img-para">
              <div className="book-cover">
                <img src={data.cover} />
              </div>
              <Divider flexItem orientation="vertical" />
              <div className="book-details">
                <h3 className="book-title">{data.title}</h3>
                <h4 className="book-author">{data.author}</h4>
                <p>
                  {data.review} Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Vel earum nihil vitae, corrupti eveniet
                  nobis, repellat beatae voluptas rem fugiat et alias ex, amet
                  velit tenetur ab quis eaque nisi in fugit! Nisi, repellat
                  eligendi. Lorem ipsum, dolor sit amet consectetur adipisicing
                  elit. <br></br><br></br>Atque natus corrupti animi voluptatibus ratione maxime
                  dolorum cumque sunt vitae esse modi expedita nobis magni,
                  earum repellat quam dolorem sed quaerat corporis tempora neque
                  nemo. Quisquam ipsam, iste ipsa, iusto eos praesentium atque
                  soluta dolor, ea maxime iure vel quos debitis quod! Porro quia
                  sit reiciendis libero recusandae nulla magni! Quod nihil
                  deserunt itaque laudantium! Et eos reprehenderit, fugit, nulla
                  facilis odit alias magnam iure quibusdam perspiciatis omnis
                  labore, officiis quasi!
                </p>
              </div>
            </div>
            <Divider flexItem orientation="horizontal" sx={{my: "1rem"}}/>
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
