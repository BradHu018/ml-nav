import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import HeroStats from "./components/HeroStats";
import Emblems from "./components/Emblems";
import RecommendedBuilds from "./components/RecommendedBuilds";
import Tips from "./components/Tips";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      <Navbar setPage={setPage} />

      <main>
        {page === "home" && <Home />}
        {page === "heroes" && <HeroStats />}
        {page === "emblems" && <Emblems />}
        {page === "builds" && <RecommendedBuilds />}
        {page === "tips" && <Tips />}
      </main>
    </>
  );
}