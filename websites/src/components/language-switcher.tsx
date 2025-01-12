import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-[68px] flex items-center justify-center text-gray-600 hover:bg-black/10 hover:text-gray-900  rounded-md p-1 cursor-pointer transition-colors duration-200">
          <Languages className="w-5 h-5 mr-1" />
          {i18n.language === 'zh' ? '中文' : 'En'}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => changeLanguage('zh')}>
          中文
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('en')}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
