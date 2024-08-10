import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import JournalPage from "./components/JournalPage";
import ResponsePage from "./components/ResponsePage";
import CalendarPage from "./components/CalendarPage";
import Home from "./components/Home";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/response" element={<ResponsePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </>
  );
}

export default App;
