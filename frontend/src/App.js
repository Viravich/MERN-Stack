import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
//components import
import AddReview from "./components/add-review";
import Restaurants from "./components/restaurants";
import RestaurantsList from "./components/restaurants-list";
import Login from "./components/login";

function App() {
  const [user, setUser] = useState(null);

  //login function
  async function login(user = null) {
    setUser(user);
  }

  //logout function
  async function logout() {
    setUser(null);
  }

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/restaurants" className="navbar-brand">
          Restaurants Reviews
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/restaurants"} className="nav-link">
              Restaurants
            </Link>
          </li>
          <li className="nav-item">
            {user ? (
              <a
                onClick={logout}
                className="nav-link"
                style={{ cursor: "pointer" }}
              >
                Logout {user.name}
              </a>
            ) : (
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            )}
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route exact path={"/"} element={<RestaurantsList />} />
          <Route exact path={"/restaurants"} element={<RestaurantsList />} />

          <Route
            path="restaurants/:id/review"
            render={(props) => {
              <AddReview {...props} user={user} />;
            }}
          />
          <Route
            path="/restaurants/:id"
            render={(props) => {
              <Restaurants {...props} user={user} />;
            }}
          />
          <Route
            path="/login"
            element={<Login />}
            render={(props) => <Login {...props} login={login} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
