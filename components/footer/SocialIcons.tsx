import { Facebook, Instagram } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants/contactInfo';

const iconMap = {
  Facebook,
  Instagram
};

export function SocialIcons() {
  return (
    <div className="flex space-x-3">
      {SOCIAL_LINKS.map(({ name, href, color }, index) => {
        const Icon = iconMap[name as keyof typeof iconMap];
        return (
          <button
            key={index}
            onClick={() => window.open(href, '_blank')}
            className={`w-12 h-12 bg-gradient-to-br ${color} hover:scale-110 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 shadow-soft hover:shadow-md group`}
          >
            <Icon className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
          </button>
        );
      })}
    </div>
  );
}