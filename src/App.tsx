import LanguageSwitcher from "./components/LanguageSwitcher"
import { useTranslation } from 'react-i18next';



function App() {
  // useTranslation hook provides access to the translation function 't'
  const { t } = useTranslation();

  return (
    <main className="text-red-700">
      <LanguageSwitcher />
      <h1>{t('hero.subtitle')}</h1>
    </main>
  )
}

export default App
