import Book from "../components/Book.jsx";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  startAfter,
  startAt,
} from "firebase/firestore";
import { db } from "../firebase/config.js";
import Header from "../components/Header.jsx";
import { useSelector } from "react-redux";
import { selectBooks } from "../store/booksSlice.js";
import Categories from "../components/Categories.jsx";
import { Divider } from "@mui/material";
import { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch } from "react-redux";
import { returnDataFromDb } from "../store/booksSlice.js";
import { DualRing, Ellipsis, Ring } from "react-css-spinners";
import ErrorBackDrop from "../components/ErrorBackDrop.jsx";
import ReplayIcon from "@mui/icons-material/Replay";
function BooksPage() {
  const dispatch2 = useDispatch();
  const data = useSelector(selectBooks);
  const [showCatchError, setshowCatchError] = useState(false);
  const [bookIsLoading, setBookIsLoading] = useState(true);
  const [isloadMore, setIsLoadMore] = useState(false);


  const pageTitle = "📖 Explore Our Miraids of Inspirition";

  useEffect(() => {
    const populateBookSlice = async () => {
      try {
        if (data.length > 0) {
          setBookIsLoading(false);
          return () => {};
        }
        const booksRef = collection(db, "Books");
        const queryData = query(booksRef, orderBy("title", "desc"), limit(3));

        const querySnapshot = await getDocs(queryData);
        const database = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        dispatch2(returnDataFromDb(database));
        setBookIsLoading(false);
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
        // You might want to set an error state or show a user-friendly message
        setBookIsLoading(false);
        setshowCatchError(true)
      }
    };
    populateBookSlice();
  }, []);

  // get the next set of books
  let lastVisible;
  const getNextBookSlice = async () => {
    setIsLoadMore(true);
    // cosnt last_index_value = records[records.length - 1].created_at;
    lastVisible = data[data.length - 1];
    const title = lastVisible.title;
    console.log("last", title);
    try {
      const booksRef = collection(db, "Books");
      const queryData = query(
        booksRef,
        orderBy("title", "desc"),
        startAfter(title),
        limit(3)
      );

      const querySnapshot = await getDocs(queryData);

      if (querySnapshot.empty) {
        console.log("no more");
      setIsLoadMore(false);
        // display nice toast
        return;
      }

      const database = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      dispatch2(returnDataFromDb(database));
      setIsLoadMore(false);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching data:", error);
      setIsLoadMore(true);
      setshowCatchError(true)


      // You might want to set an error state or show a user-friendly message
    }
  };

  console.log(data);

  // useEffect(() => {
  // window.rEventListener("scroll", handleScroll);

  // }, [handleScroll]);

  // Attach the event listener when the component mounts

  // Remove the event listener when the component unmounts
  // Empty dependency array means this effect runs once when the component mounts

  return (
    <>
      <Header />
      {<ErrorBackDrop setshowCatchError= {setshowCatchError} showCatchError={showCatchError}/>}
      <div className="container">
        <Categories setBookIsLoading={setBookIsLoading} />
        <Divider flexItem orientation="horizontal" sx={{ px: 5 }} />
        <h2 className="page-title">{pageTitle}</h2>
        <div className="books-container">
          {bookIsLoading ? (
            <div className="css-spinners">
              <Ellipsis color="#0d1f41" />
            </div>
          ) : (
            <div className="books-list">
              {data.length === 0 && (
                <div className="not-found">
                  <div>Oops! Book was not found, kindly request a review. </div>
                </div>
              )}
              {data.map((book) => (
                <Book key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="bottom-loader">
        <div>
          <svg className="arrows">
            <path class="a1" d="M0 0 L30 32 L60 0"></path>
            <path class="a2" d="M0 20 L30 52 L60 20"></path>
            <path class="a3" d="M0 40 L30 72 L60 40"></path>
          </svg>
        </div>
        {!isloadMore && (
          <p onClick={getNextBookSlice} className="more">
           
            <ReplayIcon /> <span>more books</span>
          </p>
        )}
        <div className="css-spinners more">
          {isloadMore && <Ellipsis size={40} color="#f9ad6a" />}
        </div>
      </div>
    </>
  );
}

export default BooksPage;
