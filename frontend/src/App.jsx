import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import EditPage from "./pages/EditPage";
import ViewNote from "./pages/ViewNote";
import ProtectedRoute from "./components/ProtectedRoute ";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/edit/:id" element={<EditPage />} />
        <Route path="/view/:id" element={<ViewNote />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
