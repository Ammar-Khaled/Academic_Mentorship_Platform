import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { ModeToggle } from './mode-toggle';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set initial direction
    const lang = i18n.language || 'en';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [i18n.language]);

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    // Update document direction for RTL
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="gap-2">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="text-xs font-medium uppercase">
            {i18n.language === 'ar' ? 'العربية' : 'English'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
          English {i18n.language === 'en' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('ar')}>
          العربية {i18n.language === 'ar' && '✓'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ThemeAndLanguageToggle() {
  return (
    <div className="flex items-center gap-2">
      <ModeToggle />
      <LanguageToggle />
    </div>
  );
}
