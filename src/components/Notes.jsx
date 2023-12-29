import { useSelector, useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import {
  selectNotes,
  addComment,
  returnFromDb,
  eraseNote,
  liked,
  unLiked,
} from "../store/notesSlice.js";
import {
  populatePropertyNames,
  populateUniqueUser,
  selectUserData,
  updateLike,
  updateUnlike,
  addNewCommentId,
} from "../store/userDataSlice.js";
import { db } from "../firebase/config.js";
import {
  collection,
  getDocs,
  setDoc,
  addDoc,
  orderBy,
  query,

  limit,
  startAfter,
  
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
  const userData = useSelector(selectUsers);
  const userId = userData.currentUser.id;

  const dispatch2 = useDispatch();
  const comments = useSelector(selectNotes).filter(
    (comment) => comment.book_id == bookId
  );
  const allComments = useSelector(selectNotes);
  const userState = useSelector(selectUserData);
  const commentKeysId = userState.propertyNames;
  // console.log(allComments)

  const uniqueUser = userState.uniqueUser;
  let newId = Math.max(...useSelector(selectNotes).map((note) => note.id)) + 1;
  // const likersData = useSelector(selectLikes);
  console.log(newId);
  const location = useLocation();

  useEffect(() => {
    if (comments.length > 0) {
      setisCommentLoading(false);
      return () => {};
    }

    const populateCommentSlice = async () => {
      const commentRef = collection(db, "Comments")
      const queryData = query(commentRef, orderBy("time", "desc"), limit(4));
      const querySnapshot = await getDocs(queryData);
      const database = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log(database);
      dispatch2(returnFromDb(database));
      setisCommentLoading(false);
    };
    const populateLikesSlice = async () => {
      const querySnapshot = await getDocs(collection(db, "likers"));
      const database = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // console.log(database);
      dispatch2(returnLikesFromDb(database));
      const Uniqueuser = database.find(
        (eachUserdata) => eachUserdata.id === userId
      );
      if (Uniqueuser) {
        dispatch2(populateUniqueUser(Uniqueuser));
      }
      const propertyNames = Object.keys(Uniqueuser);
      // console.log(Uniqueuser);
      if (propertyNames) {
        dispatch2(populatePropertyNames(propertyNames));
      }

      // console.log(propertyNames);
    };
    populateLikesSlice();
    populateCommentSlice();
  }, [location.pathname]);

  console.log(uniqueUser);
  console.log(commentKeysId);

  let lastVisible;
  const getNextcomment = async () => {
    setIsLoadMore(true);
    // cosnt last_index_value = records[records.length - 1].created_at;
    lastVisible = comments[comments.length - 1];
    const time = lastVisible.time;
    console.log("last", time);
    try {
      const commentsRef = collection(db, "Comments");
      const queryData = query(
        commentsRef,
        orderBy("time", "desc"),
        startAfter(time),
        limit(4)
      );

      const querySnapshot = await getDocs(queryData);

      if (querySnapshot.empty) {
        console.log("no more");
        // setIsLoadMore(false);
        // display nice toast
        return;
      }

      const database = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      dispatch2(returnDataFromDb(database));
      // setIsLoadMore(false);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching data:", error);
      // setIsLoadMore(false);
   

      // You might want to set an error state or show a user-friendly message
    }
  };

  // add comment
  const handleAddComment = async (e) => {
    e.preventDefault();

    const sameExit = allComments.find((comment) => comment.id === newId);

    console.log(sameExit);
    if (sameExit) {
      newId = newId + 1;
      dispatch2(addNewCommentId(newId));
    } else {
      dispatch2(addNewCommentId(newId));
    }

    console.log(userState);
    console.log(newId);
    const newComment = {
      id: newId,
      book_id: bookId,
      // time: serverTimestamp(),
      name: document.querySelector("input[name=name]").value,
      text: document.querySelector("textarea[name=comment]").value,
      likes: 0,
    };
    if (newComment.name && newComment.text) {
      setsubmitComment(true);
      const data = {
        book_id: bookId,
        name: document.querySelector("input[name=name]").value,
        text: document.querySelector("textarea[name=comment]").value,
        likes: 0,
        userId: userId,
      };

      const newStringId = String(newId);
      await setDoc(doc(db, "Comments", newStringId), data);
      dispatch2(addComment(newComment));

      if (uniqueUser) {
        const docRef = doc(db, "likers", userId);
        await setDoc(docRef, { [newId]: false }, { merge: true });
      }
      setsubmitComment(false);

      // dispatch(addComment(newNote));
      // document.querySelector("input[name=comment]").value = "";
      // document.querySelector("textarea[name=name]").value = "";
    } else {
      alert("Please fill the mandatory fields.");
    }
  };

  // Delete comment
  const handleEraseNote = async (id) => {
    confirm("sure to delete!");
    const newStringId = String(id);
    await deleteDoc(doc(db, "Comments", newStringId));
    dispatch2(eraseNote(id));
  };

  // Like comment
  const handleLike = async (id) => {
    console.log(uniqueUser);

    if (uniqueUser) {
      dispatch2(updateLike(id));
    }

    if (uniqueUser) {
      dispatch2(liked(id));
    }

    // if (!UniqueUser[id])  {
    //   const docRef = doc(db, "likers", userId);
    //   await setDoc(docRef, { [id]: true }, { merge: true });
    // }
    if (uniqueUser) {
      const docRef = doc(db, "likers", userId);
      await updateDoc(docRef, { [id]: !uniqueUser[id] });
    }

    // if (user.uid){
    //     const uniqueUserlikes = likersData.find(comment_id => comment_id === userId)
    // }
    const commentWithId = doc(db, "Comments", id);
    let commentId = comments.find((note) => note.id === id);
    await updateDoc(commentWithId, {
      likes: increment(1),
    });
  };

  // Unlike comment
  const handleUnlike = async (id) => {
    if (uniqueUser) {
      dispatch2(updateUnlike(id));
    }
    if (uniqueUser) {
      dispatch2(unLiked(id));
    }

    if (uniqueUser) {
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
              <p className="not-found">Be the First to comment!</p>
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
                    {commentKeysId.map((commentKey) => (
                      <div key={commentKey} style={{}}>
                        {commentKey === comment.id &&
                          uniqueUser[comment.id] === true && (
                            <div
                              className="icons"
                              onClick={() => handleUnlike(comment.id)}
                            >
                              <FavoriteIcon />
                            </div>
                          )}
                        {commentKey === comment.id &&
                          !uniqueUser[comment.id] && (
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
                      {comment.userId === userId && <DeleteIcon />}
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
                maxLength={200}
                placeholder="your comment..."
              />
            </div>

            <button
              onClick={(e) => {
                handleAddComment(e);
              }}
              // disabled={issubmitComment}
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
