import LanguageSwitcher from "./components/LanguageSwitcher"
import { useTranslation } from 'react-i18next';
import { useDirection } from "./hooks/useDirection";
import ThemeToggle from "./components/ThemeToggle";
import HeroSection from "./components/HeroSection";
import PlanSection from "./components/PlanSection";



function App() {
  useDirection()
  // useTranslation hook provides access to the translation function 't'
  const { t } = useTranslation();

  return (
    <main >
      <HeroSection />
      <LanguageSwitcher />
      <ThemeToggle />
      <h1 className="text-4xl font-extrabold text-gradient-violet">{t('hero.title')}</h1>
      <h1 className="text-4xl font-extrabold text-gradient-amber">{t('hero.subtitle')}</h1>
      <PlanSection/>
    </main>
  )
}

export default App
