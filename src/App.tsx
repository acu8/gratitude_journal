import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Route/ProtectedRoute";
import Login from "./components/Login";
import { JournalPage } from "./components/JournalPage";
import ResponsePage from "./components/ResponsePage";
import CalendarPage from "./components/CalendarPage";
import "./App.css";
import NewUserPage from "./components/NewUserPage";
import { UserProvider } from "./Context/UserContext";

function App() {
  return (
    <>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/newuser" element={<NewUserPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/response" element={<ResponsePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Route>
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;
