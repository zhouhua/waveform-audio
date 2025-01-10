import { Link } from "react-router-dom";
import { AudioLines, BookOpenText, CassetteTape, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { SiGithub } from "@icons-pack/react-simple-icons";

export default function HomePage() {
  const { t } = useTranslation();
  const list = [
    {
      title: 'Waveform Player',
      to: '/player',
      icon: <AudioLines className="w-5 h-5" />,
      description: t('home.description'),
    },
    {
      title: 'Waveform Recorder',
      to: '/recorder',
      icon: <CassetteTape className="w-5 h-5" />,
      description: t('recorder.description'),
    },
  ];
  return (
    <div className="flex flex-col items-center gap-12">
      {list.map((item) => (
        <div key={item.to}>
          <div className="border p-8 rounded-lg w-[400px] bg-white/40 backdrop-blur-lg relative z-[2] shadow-lg">
            <Link to={item.to} className="flex items-center gap-4 text-xl">
              {item.icon}
              {item.title}
            </Link>
            <p className="text-gray-500 mt-8 text-justify">{item.description}</p>
            <Link
              to={item.to}
              className={cn(
                'absolute right-4 top-4 border rounded-full p-2',
                'hover:bg-black/5 hover:scale-110 bg-black/15',
                'flex items-center justify-center',
                'transition-all duration-200',
                'hover:border-gray-400'
              )}
            >
              <Play className="w-5 h-5 fill-black/80" />
            </Link>
          </div>
          <div className="flex items-center justify-end px-4 mx-4 bg-white/40 backdrop-blur-lg h-8 border relative z-[1] -top-px rounded-b-lg shadow-md gap-4">
            <Link to={item.to} className="transition-colors duration-200 text-black/50 hover:text-black" title={t('home.docs')}>
              <BookOpenText className="w-4 h-4" />
            </Link>
            <a href="https://github.com/zhouhua/waveform-audio" target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 text-black/50 hover:text-black" title={t('home.github')}>
              <SiGithub className="w-4 h-4" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
