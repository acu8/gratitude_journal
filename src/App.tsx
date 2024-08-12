import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import JournalPage from "./components/JournalPage";
import ResponsePage from "./components/ResponsePage";
import CalendarPage from "./components/CalendarPage";
import Home from "./components/Home";
import "./App.css";
import NewUserPage from "./components/NewUserPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/response" element={<ResponsePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/newuser" element={<NewUserPage />} />
      </Routes>
    </>
  );
}

export default App;
