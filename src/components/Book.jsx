import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";


function Book({ book }) {
  const dispatch = useDispatch();


  
  return (
    <>
      <div className="book">
        <div className="book-cover">
          <img src={book.cover} />
          <Link to={"/book/" + book.id}>
            <button>
              <i className="fa-solid fa-eye"></i>
              <span>Read Review</span>
            </button>
          </Link>
        </div>

        <div className="book-details">
          <p className="book-author">{book.author}</p>
          <h3 className="book-title">{book.title}</h3>
        </div>
      </div>
    </>
  );
}

export default Book;
