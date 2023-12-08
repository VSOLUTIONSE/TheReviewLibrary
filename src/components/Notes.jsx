import { useSelector, useDispatch } from "react-redux";
import {
  selectNotes,
  addComment,
  returnFromDb,
  eraseNote,
} from "../store/notesSlice.js";
import { db } from "../firebase/config.js";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { Circle, Ellipsis } from "react-css-spinners";

function Notes({ bookId }) {
  const [issubmitComment, setsubmitComment] = useState(false);
  const [isCommentLoading, setisCommentLoading] = useState(true);

  useEffect(() => {
    const populateCommentSlice = async () => {
      const querySnapshot = await getDocs(collection(db, "Comments"));
      const database = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch2(returnFromDb(database));
      setisCommentLoading(false);
    };
    populateCommentSlice();
  }, []);

  const dispatch2 = useDispatch();
  const comments = useSelector(selectNotes).filter(
    (comment) => comment.book_id == bookId
  );

  const handleAddComment = async (e) => {
    e.preventDefault();

    const newComment = {
      book_id: bookId,
      time: serverTimestamp(),
      name: document.querySelector("input[name=name]").value,
      text: document.querySelector("textarea[name=comment]").value,
    };
    if (newComment.name && newComment.text) {
      setsubmitComment(true);
      const docRef = await addDoc(collection(db, "Comments"), newComment);
      dispatch2(addComment(newComment));
      setsubmitComment(false);

      // dispatch(addComment(newNote));
      // document.querySelector("input[name=comment]").value = "";
      // document.querySelector("textarea[name=name]").value = "";
    } else {
      alert("Please fill the mandatory fields.");
    }
  };
  
  console.log("submit", issubmitComment);

  const handleEraseNote = async (id) => {
    confirm("sure to delete!")
    await deleteDoc(doc(db, "Comments", id));
    dispatch2(eraseNote(id));
  };

  return (
    <>
      <div className="notes-wrapper">
        <h2>Rewiew Comments</h2>

        {isCommentLoading ? (
          <div>
            <div className="css-spinners">
              <Ellipsis color="#0d1f41" size={30} />
            </div>
          </div>
        ) : (
          <div className="notes">
            {comments.length === 0 && (
              <p className="not-found">No comment yet</p>
            )}
            {comments.map((comment) => (
              <div key={comment.id} className="note">
                <div
                  onClick={() => handleEraseNote(comment.id)}
                  className="erase-note"
                >
                  Erase note
                </div>
                <h3>{comment.name}</h3>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
        )}

        <details>
          <summary>Write a comment</summary>
          <form className="add-note">
            <div className="form-control">
              <label>Name</label>
              <input
                type="text"
                name="name"
                className="input-class"
                placeholder="full name"
              />
            </div>
            <div className="form-control">
              <label>comment *</label>
              <textarea
                type="text"
                name="comment"
                placeholder="your comment..."
              />
            </div>

            <button
              onClick={(e) => {
                handleAddComment(e);
              }}
              disabled={issubmitComment}
              className="btn btn-block"
            >
              {issubmitComment ? <Ellipsis size={30} /> : "comment"}
            </button>
          </form>
        </details>
      </div>
    </>
  );
}

export default Notes;
