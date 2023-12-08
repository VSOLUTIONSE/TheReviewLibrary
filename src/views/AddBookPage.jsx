import Header from "../components/Header.jsx";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config.js";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { Ellipsis, Ring } from "react-css-spinners";

function AddBookPage() {
  const [issubmitComment, setsubmitComment] = useState(false);

  const handleAddBook = async (e) => {
    try {
      e.preventDefault();

      const newBook = {
        title: document.querySelector("input[name=title]").value,
        isRead: false,
        author: document.querySelector("input[name=author]").value,
        synopsis: document.querySelector("textarea[name=synopsis]").value,
      };

      if (newBook.title && newBook.author) {
        setsubmitComment(true);
        const docRef = await addDoc(collection(db, "review-request"), newBook);
        console.log(docRef);
        setsubmitComment(false);
        alert("Request successful!");
      } else {
        alert("Please fill the mandatory fields.");
      }
    } catch (error) {
      // Handle errors here
      console.error("Error adding book:", error);
      // You might want to set an error state or show a user-friendly message
      setsubmitComment(false);
    }
  };

  const pageTitle = "Request a Review";

  return (
    <>
      <Header />
      <div className="container">
        <h2 className="page-title">{pageTitle}</h2>

        <form onSubmit={handleAddBook} className="add-form">
          <div className="form-control">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              className="input-class"
              placeholder="Book Title"
            />
          </div>
          <div className="form-control">
            <label>Author *</label>
            <input
              type="text"
              name="author"
              className="input-class"
              placeholder="Book Author"
            />
          </div>

          <div className="form-control">
            <label>Synopsis</label>
            <textarea
              type="text"
              name="synopsis"
              placeholder="any info about the book..."
            />
          </div>

          <button type="submit" className="btn btn-block">
            {issubmitComment ? (
              <div className="css-spinners">
                <Ellipsis size={30} />
              </div>
            ) : (
              "Request review"
            )}
          </button>
        </form>
      </div>
    </>
  );
}

export default AddBookPage;
