import { NavLink } from "react-router-dom";
import Logo from "../assets/img/logo.jpg";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useDispatch } from "react-redux";
import { setUsers } from "../store/usersSlice";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdbIcon from "@mui/icons-material/Adb";
import  Avatar  from "@mui/material/Avatar";
import { useSelector } from "react-redux";
import { selectUsers } from "../store/usersSlice";

function Header({ pageTitle }) {
  const dispatch2 = useDispatch();
  const users = useSelector(selectUsers);

  const userEmail = users.currentUser.email;
  let account = userEmail.charAt(0).toUpperCase();
  console.log(account);

  const handleSignOut = () => {
    if (confirm("Are you sure you want to Logout?")) {
      signOut(auth)
        .then(() => {
          dispatch2(setUsers(null));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const pages = ["Products", "Pricing", "Blog"];
  const settings = ["Profile", "Account", "Dashboard", "Logout"];

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar position="static">
        <Container className="navContainer" maxWidth="xl">
          <Toolbar disableGutters>
            <Avatar
              src={Logo}
              alt=""
              className="logo1"
              sx={{ display: { xs: "none", md: "flex" }, mr: 3 }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Hidden Treasure
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                  mt: " 2%",
                  width: "40%",
                }}
              >
                <MenuItem
                  sx={{
                    display: { xs: "flex", md: "none" },
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: { sm: "0.7rem", md: "rem" },
                    textTransform: "capitalize",
                    p: "2px",
                    textAlign: "center",
                  }}
                  onClick={handleCloseNavMenu}
                >
                  <NavLink onClick={handleCloseNavMenu} to="/">
                    <Button
                      sx={{
                        fontSize: { xs: "0.8rem", md: "1rem" },
                        textTransform: "capitalize",
                        color: "#0d1f41",
                        fontWeight: "900",
                      }}
                    >
                      Books
                    </Button>
                  </NavLink>
                  <NavLink onClick={handleCloseNavMenu} to="/add-book">
                    <Button
                      sx={{
                        fontSize: { xs: "0.8rem", md: "1rem" },
                        textTransform: "capitalize",
                        color: "#0d1f41",
                        fontWeight: "900",
                      }}
                    >
                      Request a review
                    </Button>
                  </NavLink>
                  <Button
                    sx={{
                      fontSize: { xs: "0.8rem", md: "1rem" },
                      textTransform: "capitalize",
                      color: "#0d1f41",
                      fontWeight: "900",
                    }}
                    onClick={handleSignOut}
                  >
                    Logout
                  </Button>
                </MenuItem>
              </Menu>
            </Box>
            <Avatar
              src={Logo}
              alt=""
              className="logo1"
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize: ".9rem",
                letterSpacing: {xs:".2rem", sm: ".3rem"},
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Hidden Treasure
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex", justifyContent: "right" },
              }}
            >
              <NavLink
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
                to="/"
              >
                <button className="btn">Books</button>
              </NavLink>
              <NavLink
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
                to="/add-book"
              >
                <button className="btn">Request a review</button>
              </NavLink>
              {/* <Link
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              ></Link> */}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ background: "#faa75e" }}>
                    {users.currentUser ? (
                      <h4>{account}</h4>
                    ) : (
                      <AccountCircleIcon />
                    )}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px", p: "1px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Button
                    variant="text"
                    onClick={handleSignOut}
                    className="btn transparent"
                    sx={{
                      fontSize: { xs: "0.8rem", md: "1rem" },
                      textTransform: "capitalize",
                      color: "#0d1f41",
                      fontWeight: "900",
                    }}
                  >
                    Logout
                  </Button>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 
            <div className="header-btns">

                    <NavLink to="/">
                      <button className="btn">
                          Books
                      </button>
                    </NavLink>

                    <NavLink to="/add-book">
                      <button className="btn">
                          Request a Review
                      </button>
                    </NavLink>

                    <button onClick={handleSignOut} className="btn transparent">
                      Logout
                    </button>

               
            </div>
     */}
    </>
  );
}

export default Header;
