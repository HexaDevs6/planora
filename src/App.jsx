// import LanguageSwitcher from "./components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useDirection } from "./hooks/useDirection";
// import ThemeToggle from "./components/ThemeToggle";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import FooterSection from "./components/FooterSection";
import About from "./pages/About";

function App() {
   useDirection();
   // useTranslation hook provides access to the translation function 't'
   const { t } = useTranslation();
   return (
      <main>
         <BrowserRouter>
				<NavBar />
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/about" element={<About />} />
               <Route path="/contact" element={<Contact />} />
            </Routes>
				<FooterSection />
         </BrowserRouter>



         {/* <ThemeToggle />
         <LanguageSwitcher />
         <h1 className="text-4xl font-extrabold text-gradient-violet">
            {t("hero.title")}
         </h1>
         <h1 className="text-4xl font-extrabold text-gradient-amber">
            {t("hero.subtitle")}
         </h1> */}
      </main>
   );
}

export default App;
