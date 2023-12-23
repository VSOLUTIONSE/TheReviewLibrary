import { useSelector, useDispatch } from "react-redux";
import {
  selectNotes,
  addComment,
  returnFromDb,
  eraseNote,
  liked,
  unLiked,
} from "../store/notesSlice.js";
import { db } from "../firebase/config.js";
import {
  collection,
  getDocs,
  setDoc,
  addDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  increment,
  updateDoc,
} from "firebase/firestore";
import { setUsers, selectUsers } from "../store/usersSlice.js";
import { returnLikesFromDb, selectLikes } from "../store/likesSlice.js";

import { useState, useEffect } from "react";
import { Circle, Ellipsis } from "react-css-spinners";
import Avatar from "@mui/material/Avatar";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

function Notes({ bookId }) {
  const [issubmitComment, setsubmitComment] = useState(false);
  const [isCommentLoading, setisCommentLoading] = useState(true);
  const [commentkeys, setCommentId] = useState(["1", "4"]);
  const [UniqueUser, setUniqueUser] = useState(true);
  const userData = useSelector(selectUsers);
  const userId = userData.currentUser.id;
  // console.log(likersData)

  const dispatch2 = useDispatch();
  const comments = useSelector(selectNotes).filter(
    (comment) => comment.book_id == bookId
  );

  const allComments = useSelector(selectNotes);
  // const likersData = useSelector(selectLikes);

  useEffect(() => {
    if (comments.length > 0) {
      setisCommentLoading(false);
      return () => {};
    }

    const populateCommentSlice = async () => {
      const querySnapshot = await getDocs(collection(db, "Comments"));
      const database = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch2(returnFromDb(database));
      setisCommentLoading(false);
    };
    const populateLikesSlice = async () => {
      const querySnapshot = await getDocs(collection(db, "likers"));
      const database = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(database);
      dispatch2(returnLikesFromDb(database));
      const Uniqueuser = database.find(
        (eachUserdata) => eachUserdata.id === userId
      );
      const propertyNames = Object.keys(Uniqueuser);
      console.log(Uniqueuser);
      setUniqueUser(Uniqueuser);
      console.log(propertyNames);
      setCommentId(propertyNames);
    };
    populateLikesSlice();
    populateCommentSlice();
  }, []);

  console.log(UniqueUser);

  const handleAddComment = async (e) => {
    e.preventDefault();

    const newId = allComments.length
      ? Math.max(...allComments.map((note) => note.id)) + 1
      : 1;

    console.log(newId);
    const newComment = {
      id: newId,
      book_id: bookId,
      time: serverTimestamp(),
      name: document.querySelector("input[name=name]").value,
      text: document.querySelector("textarea[name=comment]").value,
      likes: 0
    };
    if (newComment.name && newComment.text) {
      setsubmitComment(true);
      const data = {
        book_id: bookId,
        // time: serverTimestamp(),
        name: document.querySelector("input[name=name]").value,
        text: document.querySelector("textarea[name=comment]").value,
        likes: 0
      }
      await setDoc(doc(db, "Comments", newId), data);
      dispatch2(addComment(newComment));
      setsubmitComment(false);

      // dispatch(addComment(newNote));
      // document.querySelector("input[name=comment]").value = "";
      // document.querySelector("textarea[name=name]").value = "";
    } else {
      alert("Please fill the mandatory fields.");
    }
  };

  // console.log("submit", issubmitComment);

  const handleEraseNote = async (id) => {
    confirm("sure to delete!");
    await deleteDoc(doc(db, "Comments", id));
    dispatch2(eraseNote(id));
  };
  const handleLike = async (id) => {
    console.log(UniqueUser);

    // if (!UniqueUser[id])  {
    //   const docRef = doc(db, "likers", userId);
    //   await setDoc(docRef, { [id]: true }, { merge: true });
    // }

    if (UniqueUser) {
      const docRef = doc(db, "likers", userId);
      await updateDoc(docRef, { [id]: !UniqueUser[id] });
    }

    // if (user.uid){
    //     const uniqueUserlikes = likersData.find(comment_id => comment_id === userId)
    // }
    const commentWithId = doc(db, "Comments", id);
    let commentId = comments.find((note) => note.id === id);
    await updateDoc(commentWithId, {
      likes: increment(1),
    });
    dispatch2(liked(id));
  };
  const handleUnlike = async (id) => {
    if (UniqueUser) {
      const docRef = doc(db, "likers", userId);
      await updateDoc(docRef, { [id]: false });
    }

    let commentId = comments.find((note) => note.id === id);
    // let Boolean = commentId.isLiked;
    if (commentId.likes === 0) return;
    const commentWithId = doc(db, "Comments", id);
    await updateDoc(commentWithId, {
      likes: commentId.likes - 1,
    });
    dispatch2(unLiked(id));
  };

  // console.log(commentkeys)
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
            {comments?.map((comment) => (
              <section key={comment.id} className="note-cont">
                <Avatar sx={{ mt: 1, background: "" }}>
                  {comment.name.charAt(0).toUpperCase()}
                </Avatar>
                <div className="note">
                  <h3>{comment.name}</h3>
                  <p>{comment.text}</p>
                  <div className="engage">
                    {commentkeys.map((commentKey) => (
                      <div key={commentKey} style={{}}>
                        {commentKey === comment.id &&
                          UniqueUser[comment.id] === true && (
                            <div
                              className="icons"
                              onClick={() => handleUnlike(comment.id)}
                            >
                              <FavoriteIcon />
                            </div>
                          )}
                        {commentKey === comment.id &&
                          UniqueUser[comment.id] !== true && (
                            <div
                              className="icons"
                              onClick={() => handleLike(comment.id)}
                            >
                              <FavoriteBorderIcon />
                            </div>
                          )}
                      </div>
                    ))}
                    <p className="likes">{comment.likes} likes</p>
                    <div
                      onClick={() => handleEraseNote(comment.id)}
                      className="erase-note"
                    >
                      <DeleteIcon />
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}

        <details>
          <summary className="write-comment">Drop a comment</summary>
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
                max=""
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
