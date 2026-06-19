import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    // Update document direction for RTL/LTR support
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      className="!inline-flex h-9 shrink-0 !flex-row items-center gap-2 px-2 whitespace-nowrap"
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-medium uppercase">
        {i18n.language === 'en' ? 'العربية' : 'English'}
      </span>
    </Button>
  );
}