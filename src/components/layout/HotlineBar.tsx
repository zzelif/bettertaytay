import { FC } from 'react';
import { PhoneIcon } from 'lucide-react';

import hotlinesData from '../../data/philippines_hotlines.json';
import { Hotline, HotlineProps } from '@/lib/hotline';
import { getShortHotlineName } from '@/lib/stringUtils';
import { toTelUri } from '@/lib';

export const HotlineBar: FC<HotlineProps> = ({ maxItems = 10 }) => {
  const combinedHotlines = [
    ...(hotlinesData.criticalHotlines as Hotline[]),
    ...(hotlinesData.disasterHotlines as Hotline[]),
  ];

  const uniqueHotlines = combinedHotlines.filter(
    (hotline, index, self) =>
      index === self.findIndex(t => t.name === hotline.name)
  );

  // Mobile scrolls all maxItems, Desktop limits to 4-5 to fit on one line
  const mobileHotlines = uniqueHotlines.slice(0, maxItems);
  const desktopHotlines = uniqueHotlines.slice(0, 5);

  return (
    <div className='w-full bg-linear-to-br from-kapwa-red-700 to-kapwa-red-800'>
      {/* Mobile Marquee Keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>

      {/* =========================================
          MOBILE VIEW: Marquee Animation
          ========================================= */}
      <div className='flex flex-col overflow-hidden md:hidden'>
        {/* Scrolling Marquee Area */}
        <div className='flex overflow-hidden relative py-2.5 w-full'>
          <div className='flex space-x-6 w-max animate-marquee hover:[animation-play-state:paused] px-4'>
            {[...mobileHotlines, ...mobileHotlines].map((hotline, index) => (
              <div key={index} className='flex flex-col shrink-0'>
                <span className='text-xs font-bold tracking-wide text-kapwa-text-inverse'>
                  {getShortHotlineName(hotline.name)}
                </span>
                <div className='flex flex-wrap mt-0.5 space-x-3'>
                  {hotline.numbers.slice(0, 2).map((number, idx) => (
                    <a
                      key={idx}
                      href={toTelUri(number) || '#'}
                      className='flex items-center text-sm font-medium whitespace-nowrap text-kapwa-text-inverse/90 hover:text-kapwa-text-inverse hover:underline'
                    >
                      <PhoneIcon className='mr-1 w-3 h-3' />
                      {number}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================
          DESKTOP VIEW: Slim, Static Top Bar 
          ========================================= */}
      <div className='hidden justify-center items-center py-2 px-4 w-full text-xs md:flex'>
        {/* Label Prefix */}
        <div className='flex items-center mr-6 font-bold tracking-wider text-kapwa-text-inverse shrink-0'>
          <PhoneIcon className='mr-2 w-3.5 h-3.5 text-kapwa-text-inverse/90' />
          EMERGENCY HOTLINES:
        </div>

        {/* Inline Hotlines */}
        <div className='flex items-center space-x-5'>
          {desktopHotlines.map((hotline, index) => (
            <div key={index} className='flex items-center whitespace-nowrap'>
              <span className='mr-1.5 font-bold tracking-wide text-kapwa-text-inverse'>
                {getShortHotlineName(hotline.name)}
              </span>
              {hotline.numbers.slice(0, 1).map((number, idx) => (
                <a
                  key={idx}
                  href={toTelUri(number) || '#'}
                  className='text-kapwa-text-inverse/90 hover:text-kapwa-text-inverse hover:underline font-medium'
                >
                  {number}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
