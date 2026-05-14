import { useState } from "react";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import HeroStats from "./components/HeroStats";
import Emblems from "./components/Emblems";
import RecommendedBuilds from "./components/RecommendedBuilds";
import Tips from "./components/Tips";
import Navbar from "./components/Navbar";
import CommunityBuildsPage from "./pages/CommunityBuildsPage";
import MyBuildsPage from "./pages/MyBuildsPage";
import SavedBuildsPage from "./pages/SavedBuildsPage";
import AdminPage from "./pages/AdminPage";
import TierListPage from "./pages/TierListPage";
import "./App.css";

function App() {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  const [isLoggedIn, setIsLoggedIn] = useState(!!storedToken);
  const [user, setUser] = useState(
    storedUser ? JSON.parse(storedUser) : null
  );

  const [page, setPage] = useState("home");

  function handleAuthSuccess(loggedInUser) {
    setUser(loggedInUser);
    setIsLoggedIn(true);
    setPage("home");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setIsLoggedIn(false);
    setPage("home");
  }

  if (!isLoggedIn) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  if (user?.role === "admin") {
    return <AdminPage handleLogout={handleLogout} />;
  }

  let currentPage;

  if (page === "home") {
    currentPage = <Home />;
  } else if (page === "heroes") {
    currentPage = <HeroStats />;
  } else if (page === "emblems") {
    currentPage = <Emblems />;
  } else if (page === "builds") {
    currentPage = <RecommendedBuilds />;
  } else if (page === "community_builds") {
    currentPage = <CommunityBuildsPage />;
  } else if (page === "tips") {
    currentPage = <Tips />;
  } else if (page === "my_builds") {
    currentPage = <MyBuildsPage />;
  } else if (page === "saved_builds") {
    currentPage = <SavedBuildsPage />;
  } else if (page === "tier_list") {
    currentPage = <TierListPage />;
  } 
  else {
    currentPage = <Home />;
  }

  return (
    <>
      <Navbar setPage={setPage} handleLogout={handleLogout} />
      <main>{currentPage}</main>
    </>
  );
}

export default App;