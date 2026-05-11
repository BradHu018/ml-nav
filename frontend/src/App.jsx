import { useState } from "react";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import HeroStats from "./components/HeroStats";
import Emblems from "./components/Emblems";
import RecommendedBuilds from "./components/RecommendedBuilds";
import Tips from "./components/Tips";
import Navbar from "./components/Navbar";
import CommunityBuildsPage from "./pages/CommunityBuildsPage";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState("home");

  function handleAuthSuccess() {
    setIsLoggedIn(true);
    setPage("home");
  }

  if (!isLoggedIn) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
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
  } else {
    currentPage = <Home />;
  }

  return (
    <>
      <Navbar setPage={setPage} />
      <main>
        {currentPage}
      </main>
    </>
  );
}

export default App;