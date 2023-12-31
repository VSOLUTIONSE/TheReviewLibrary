import FullPageLoader from "../components/FullPageLoader.jsx";
import { useReducer, useState, useEffect } from "react";
import { auth, db } from "../firebase/config.js";
import { getDocs, doc, collection, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  LoginSignUpReducer,
  LoginInitialState,
} from "../reducers/loginReducer.js";
import { StyledEngineProvider } from "@mui/material/styles";
import { selectNotes,returnFromDb } from "../store/notesSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, selectUsers } from "../store/usersSlice.js";
import Logo from "../assets/img/logo.jpg";
// import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import { TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Lottie from "lottie-react";
import animationData from "../assets/Animation - 1700769630417.json";
import { motion, useAnimationControls } from "framer-motion";
import { fadeIn } from "../variants.js";
import { Ellipsis } from "react-css-spinners";
import Alert from "@mui/material/Alert";
import { useTheme, useMediaQuery } from "@mui/material";

function LoginPage() {
  // const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState("login");
  const [userCredentials, setUserCredential] = useState({});
  const [error, setError] = useState(false);
  const [errorMessage, seterrorMessage] = useState("Error! try again");
  const [state, dispatch] = useReducer(LoginSignUpReducer, LoginInitialState);
  const dispatch2 = useDispatch();

  const popControl = useAnimationControls();
const [newId, setNewId] = useState()
  

  
  useEffect(() => {
    // if (comments.length > 0) {
    //   setisCommentLoading(false);
    //   return () => {};
    // }
    const populateCommentSlice = async () => {
      const querySnapshot = await getDocs(collection(db, "Comments"));
      const database = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // console.log(database);
      let newId = Math.max(...database.map((note) => note.id))
  ;   setNewId(newId)
    };
    populateCommentSlice();
  }, []);
  console.log(newId)
  
  // mui
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("lg"));
  const tablet = useMediaQuery(theme.breakpoints.up("sm"));
  const mobile = useMediaQuery(theme.breakpoints.up("xs"));

  const sizes = () => {
    if (desktop) return "large";
    if (tablet) return "medium";
    if (mobile) return "small";
  };

  const [showPassword, setShowPassword] = useState(false);

  // password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const startRange = 1;
  const endRange = newId;

  let dynamicRangeObject = {};

  for (let i = startRange; i <= endRange; i++) {
    dynamicRangeObject[i] = false;
  }
  console.log(dynamicRangeObject);

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      dispatch2(setUsers({ id: user.uid, email: user.email }));
     
    } else {
      dispatch2(setUsers(null));
    }
    if (state.fullPageLoading) {
      dispatch({ type: "LOADER", payload: false });
    }
  });

  const handleUser = (e) => {
    setUserCredential({ ...userCredentials, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!userCredentials.email && !userCredentials.password) {
      alert("Kindly input your details first");
      return;
    }
    setError(false);
    dispatch({ type: "SIGNUP", payload: true });
    const credentials = await createUserWithEmailAndPassword(
      auth,
      userCredentials.email,
      userCredentials.password
    ).catch((error) => {
      setError(true);
      console.error(error.message);

      switch (error.code) {
        case "auth/email-already-exists":
          seterrorMessage("This user already exits");
          break;

        case "auth/invalid-password":
          seterrorMessage("Your password is invalid kindly try again");
          break;
        case "auth/invalid-email":
          seterrorMessage("The Email provided is invalid, check and try again");
          break;
        case "auth/internal-error":
          seterrorMessage(
            "sorry! there was an error while processing your request"
          );

          break;
        case "auth/weak-password":
          seterrorMessage("Password should be at least 6 characters!");

          break;
        case "auth/user-not-found":
          seterrorMessage("This user doesn't exist");
          break;
        case "auth/invalid-login-credentials":
          seterrorMessage("Wrong details!, kindly try again");
          break;
        default:
          seterrorMessage("Error! try again");
      }
      dispatch({ type: "SIGNUP", payload: false });
    });
    const docRef = doc(db, "likers", credentials.user.uid);
    await setDoc(docRef, dynamicRangeObject);
  };

  const handleLogin = (e) => {
    
    e.preventDefault();
    if (!userCredentials.email && !userCredentials.password) {
      alert("Kindly input your details first");
      return;
    }
    dispatch({ type: "LOGIN", payload: true });
    setError(false);
    signInWithEmailAndPassword(
      auth,
      userCredentials.email,
      userCredentials.password
    ).catch((error) => {
      setError(true);
      console.error(error.code);
      switch (error.code) {
        case "auth/email-already-exists":
          seterrorMessage("This user already exits");
          break;

        case "auth/invalid-password":
          seterrorMessage("Your password is invalid kindly try again");
          break;
        case "auth/invalid-email":
          seterrorMessage("The Email provided is invalid, check and try again");
          break;
        case "auth/internal-error":
          seterrorMessage(
            "sorry! there was an error while processing your request"
          );

          break;
        case "auth/user-not-found":
          seterrorMessage("This user doesn't exist");
          break;
        case "auth/invalid-login-credentials":
          seterrorMessage("Wrong details!, kindly try again");
          break;
        default:
          seterrorMessage("Something is wrong");
      }
      dispatch({ type: "LOGIN", payload: false });
    });
  };

  const handleForgotPassword = () => {
    const email = prompt("Kindly enter your email").trim();
    if (email.includes("@")) {
      sendPasswordResetEmail(auth, email);
      alert("Email sent!, check inbox for password reset instruction");
    } else {
      alert("Invalid email");
    }
  };

  const handleLoginChange = () => {
    setLoginType("login");
    popControl.start("pop");
  };
  const handleSignUpChange = () => {
    setLoginType("signup");
    popControl.start("pop");
  };

  console.log(auth);
  return (
    <>
      {state.fullPageLoading && <FullPageLoader></FullPageLoader>}
      <div className="container login-page">
        <Lottie className="lottie" animationData={animationData} />
        <StyledEngineProvider injectFirst>
          <section className="section-container">
            <motion.div
              variants={fadeIn("down", 0.3)}
              initial="hidden"
              animate="show"
              exit="hidden"
              transition={{ duration: 1, ease: "easeIn" }}
              className="login-welcome"
            >
              <h1>
                Welcome to{" "}
                <span style={{ color: "#0d1f41" }}>
                  Hidden Treasure Review Library
                </span>
              </h1>
              <p>Login or create an account to explore our book collection</p>
            </motion.div>
            <img src={Logo} alt="" className="logo" />
            <div className="login-type login-signout">
              <button
                className={`btn ${loginType == "login" ? "selected" : ""}`}
                onClick={handleLoginChange}
              >
                Login
              </button>
              <button
                className={`btn ${loginType == "signup" ? "selected" : ""}`}
                onClick={handleSignUpChange}
              >
                Signup
              </button>
            </div>
            <motion.form
              variants={fadeIn("up", 0.3)}
              initial="hidden"
              animate="show"
              exit="hidden"
              transition={{ duration: 1, ease: "easeIn" }}
              className="add-form login"
            >
              <div className="form-control">
                <FormControl
                  sx={{
                    m: 1,
                    maxWidth: "100%",
                    width: "100%",
                    minWidth: "100px",
                  }}
                >
                  <TextField
                    id="outlined-basdic"
                    type="email"
                    name="email"
                    onChange={handleUser}
                    variant="outlined"
                    label="Email"
                    size={sizes()}
                    sx={{
                      backgroundColor: "transparent",
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        "&.Mui-focused fieldset": {
                          border: "1.5px solid #4b4a4a",
                        },
                      },
                    }}
                  />
                </FormControl>
              </div>
              <div className="form-control">
                <FormControl
                  sx={{
                    m: 1,
                    maxWidth: "100%",
                    width: "100%",
                    minWidth: "100px",
                  }}
                >
                  <InputLabel
                    htmlFor="outlined-adornment-password"
                    sx={{ mt: { xs: "-2%", sm: 0 } }}
                  >
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    onChange={handleUser}
                    name="password"
                    variant="outlined"
                    // notched
                    label="Password"
                    size={sizes()}
                    sx={{
                      color: "#fff",

                      "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                        {
                          border: "1.5px solid #000",
                        },
                      "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          border: "1.5px solid #4b4a4a;",
                        },
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff sx={{ color: " #ffffffaf" }} />
                          ) : (
                            <Visibility sx={{ color: " #ffffffaf" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>
              {loginType == "login" ? (
                <motion.button
                  variants={{
                    initialPop: {
                      scale: 1,
                    },
                    pop: {
                      scale: [0.9, 1.07, 1],
                    },
                  }}
                  initial="initialPop"
                  animate={popControl}
                  onClick={handleLogin}
                  className="active btn btn-block"
                >
                  {state.login ? (
                    <div className="css-spinners">
                      <Ellipsis size={30} color="#0d1f41" />
                    </div>
                  ) : (
                    "Login"
                  )}
                </motion.button>
              ) : (
                <motion.button
                  variants={{
                    initialPop: {
                      scale: 1,
                    },
                    pop: {
                      scale: [0.9, 1.07, 1],
                    },
                  }}
                  initial="initialPop"
                  animate={popControl}
                  onClick={handleSignUp}
                  className="active btn btn-block"
                >
                  {!state.signup ? (
                    "SignUp"
                  ) : (
                    <div className="css-spinners">
                      <Ellipsis size={30} color="#0d1f41" />
                    </div>
                  )}
                </motion.button>
              )}
              {error && (
                <motion.div
                  variants={fadeIn("up", 0.1)}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                >
                  <Alert className="error" severity="error">
                    {errorMessage}
                  </Alert>
                </motion.div>
              )}

              <p onClick={handleForgotPassword} className="forgot-password">
                Forgot Password?
              </p>
            </motion.form>
          </section>
        </StyledEngineProvider>
      </div>
    </>
  );
}

export default LoginPage;
