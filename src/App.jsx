import LanguageSwitcher from "./components/LanguageSwitcher"
import { useTranslation } from 'react-i18next';
import { useDirection } from "./hooks/useDirection";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Signin from "./pages/auth/Signin";
import { BrowserRouter, Routes, Route } from 'react-router-dom';




function App() {
  useDirection()

  const { t } = useTranslation();
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
