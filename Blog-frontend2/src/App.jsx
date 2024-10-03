import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import BlogPosts from "./components/BlogPosts";
import LoginForm from "./components/LoginForm";
import Logout from "./components/Logout";
import "./App.css";
import "./styles/app-styles.css";
import { useEffect } from "react";
import { useState } from "react";
import "./App.css";

function App() {
  const emptyArray = [];

  const [jwtToken, setJwtToken] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("jwtToken"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    sessionStorage.setItem("jwtToken", JSON.stringify(jwtToken));
  }, [jwtToken]);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    sessionStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <>
      <Router>
        <NavBar
          token={jwtToken}
          user={user}
        />
        <Routes>
          <Route
            path="/"
            element={
              <BlogPosts
                token={jwtToken}
                user={user}
              />
            }
          ></Route>
          <Route
            path="/login"
            element={
              <LoginForm
                token={jwtToken}
                setToken={setJwtToken}
                user={user}
                setUser={setUser}
              />
            }
          ></Route>
          <Route
            path="/logout"
            element={
              <Logout
                setToken={setJwtToken}
                setUser={setUser}
              >
                {" "}
              </Logout>
            }
          ></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
