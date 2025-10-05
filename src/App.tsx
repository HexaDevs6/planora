import LanguageSwitcher from "./components/LanguageSwitcher"
import { useTranslation } from 'react-i18next';
import { useDirection } from "./hooks/useDirection";



function App() {
  useDirection()
  // useTranslation hook provides access to the translation function 't'
  const { t } = useTranslation();

  return (
    <main className="container">
      <LanguageSwitcher />
      <h1 className="text-4xl font-extrabold text-gradient-violet">{t('hero.title')}</h1>
      <h1 className="text-4xl font-extrabold text-gradient-amber">{t('hero.subtitle')}</h1>
    </main>
  )
}

export default App
