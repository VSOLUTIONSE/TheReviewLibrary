import React, { useState } from "react";
import { Button, capitalize } from "@mui/material";
import { useDispatch } from "react-redux";
import { selectedCategory, searchBooks } from "../store/booksSlice";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { StyledEngineProvider } from "@mui/material/styles";
import { selectBooks } from "../store/booksSlice.js";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config.js";
import { motion } from "framer-motion";
import { fadeIn } from "../variants.js";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

const Categories = ({ setBookIsLoading, setshowCatchError }) => {
  //   const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [categoryIsLoading, setCategoryLoading] = useState(true);
  const [value, setValue] = React.useState("all");

  const btnData = [
    { id: 1, name: "all" },
    { id: 2, name: "finance" },
    { id: 3, name: "inspirational" },
    { id: 4, name: "spiritual" },
    { id: 5, name: "classic" },
  ];

  const dispatch2 = useDispatch();

  const handleCategories = async (e, itermIndex) => {
    try {
      setIndex(itermIndex);
      setBookIsLoading(true);
      const selectedValue = e.target.value;
      setValue(selectedValue)
      const querySnapshot = await getDocs(collection(db, "Books"));
      const database = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      dispatch2(selectedCategory([selectedValue, database]));

      setBookIsLoading(false);
      if (database.length > 0) setBookIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoadMore(false);
      setshowCatchError(true);
    }
  };

  const handleSearchTerm = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    try {
      if (!query) {
        alert("Please enter valid input...");
        return;
      }

      setBookIsLoading(true);

      const querySnapshot = await getDocs(collection(db, "Books"));
      const database = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      dispatch2(searchBooks([query, database]));
      setBookIsLoading(false);
      setQuery("");
    } catch (error) {
      // Handle errors here
      console.error("Error fetching data:", error);
      // You might want to set an error state or show a user-friendly message
      setBookIsLoading(false);
      setshowCatchError(true);
    }
  };


  

  return (
    <>
      <StyledEngineProvider injectFirst>
        <motion.section
          className="category-search"
          variants={fadeIn("down", 0.3)}
          initial="hidden"
          animate="show"
          exit="hidden"
          transition={{ duration: 0.6, ease: "easeIn" }}
        >
          <div className="category-btn">
            <h2 className="category-h2">Category</h2>
            <Tabs
              value={value}
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              aria-label="scrollable force tabs example"
              className="btns"
            >
              {btnData.map((button, itermIndex) => (
                <Button
                  key={button.id}
                  className="active-btn"
                  // component="button"
                  
                  label={button.name}
                  sx={{
                    background: `${index === itermIndex && "#0d1f41"}`,
                    
                    color: `${index === itermIndex ? "#ffff" : "#1a3363"}`,
                    fontWeight: { xs: 500, md: 600 },
                    fontSize: { md: "1rem" },
                    textTransform: "capitalize",
                    border: "0.7px solid #1a3363",
                    mx: ".2rem"
                    // fontFamily: "Montserrat Alternates,"
                  }}
                  variant="outlined"
                  value={button.name}
                  type="button"
                  onClick={(e) => handleCategories(e, itermIndex)}
                >{button.name}</Button>
              ))}
            </Tabs>
          </div>
          <div className="search-field">
            <Paper
              variant="outlined"
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                background: "transparent",
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1, color: "#000", height: { xs: "10px" } }}
                placeholder="Search a book..."
                inputProps={{ "aria-label": "search" }}
                value={query}
                className="search-bar"
                onChange={handleSearchTerm}
              />
              <IconButton
                onClick={handleSearch}
                type="button"
                sx={{ p: "10px" }}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </div>
        </motion.section>
      </StyledEngineProvider>
    </>
  );
};

export default Categories;
