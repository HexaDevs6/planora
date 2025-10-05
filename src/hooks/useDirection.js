import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * useDirection Hook
 * 
 * This custom hook manages RTL/LTR direction based on the selected language.
 * It automatically:
 * - Detects the current language
 * - Sets the appropriate direction (RTL for Arabic, LTR for English)
 * - Updates the HTML document's dir and lang attributes
 * - Manages body classes for styling
 * - Provides direction state to components
 */
export const useDirection = () => {
   const { i18n } = useTranslation();
   const [isRTL, setIsRTL] = useState(false);

   useEffect(() => {
      /**
       * Update direction based on current language
       * Arabic (ar) = RTL, English (en) = LTR
       */
      const updateDirectionAndFont = () => {
         const currentLanguage = i18n.language;
         const isArabic = currentLanguage === 'ar';
         setIsRTL(isArabic);

         const html = document.documentElement;
         html.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
         html.setAttribute('lang', currentLanguage);

         // Remove previous classes
         html.classList.remove('rtl', 'ltr', 'font-cairo', 'font-poppins');

         // Add direction + font separately ✅
         html.classList.add(isArabic ? 'rtl' : 'ltr');
         html.classList.add(isArabic ? 'font-cairo' : 'font-poppins');
      };

      updateDirectionAndFont();

      // Add event listener for language changes
      i18n.on('languageChanged', updateDirectionAndFont);

      // Cleanup event listener on unmount
      return () => {
         i18n.off('languageChanged', updateDirectionAndFont);
      };
   }, [i18n]);

   return {
      isRTL,
      direction: isRTL ? 'rtl' : 'ltr',
      language: i18n.language
   };
};
