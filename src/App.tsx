import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import JournalPage from "./components/JournalPage";
import ResponsePage from "./components/ResponsePage";
import CalendarPage from "./components/CalendarPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/response" element={<ResponsePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </>
  );
}

export default App;
