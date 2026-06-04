import {
  BookOpenIcon,
  CloudSunIcon,
  CompassIcon,
  DollarSignIcon,
  GlobeIcon,
  LandmarkIcon,
  MapIcon,
  PaletteIcon,
  PhoneIcon,
  UtensilsIcon,
} from 'lucide-react';

import { config } from '@/lib/lguConfig';
import {
  SidebarContainer,
  SidebarGroup,
  SidebarItem,
} from '@/components/navigation/SidebarNavigation';

export default function DiscoverSidebar() {
  return (
    <SidebarContainer title='Discover Taytay'>
      <SidebarGroup title='About'>
        <SidebarItem
          path='/discover/about'
          label='About Taytay'
          icon={CompassIcon}
          description='Overview & quick facts'
        />
        <SidebarItem
          path='/discover/history'
          label='History'
          icon={BookOpenIcon}
          description='Timeline & milestones'
        />
        <SidebarItem
          path='/discover/culture'
          label='Culture & Festivals'
          icon={PaletteIcon}
          description='Heritage & celebrations'
        />
      </SidebarGroup>

      <SidebarGroup title='Explore'>
        {config.features.tourism && (
          <SidebarItem
            path='/discover/tourism'
            label='Tourism'
            icon={UtensilsIcon}
            description='Spots, dining & resorts'
          />
        )}
        <SidebarItem
          path='/discover/travel'
          label='Travel Hub'
          icon={GlobeIcon}
          description='Visa & entry requirements'
        />
        <SidebarItem
          path='/discover/map'
          label='Interactive Map'
          icon={MapIcon}
          description='Barangay boundaries'
        />
      </SidebarGroup>

      <SidebarGroup title='Utilities'>
        <SidebarItem
          path='/data/weather'
          label='Weather'
          icon={CloudSunIcon}
          description='PAGASA forecasts'
        />
        <SidebarItem
          path='/data/forex'
          label='Forex Rates'
          icon={DollarSignIcon}
          description='BSP exchange rates'
        />
        <SidebarItem
          path='/hotlines'
          label='Emergency Hotlines'
          icon={PhoneIcon}
          description='PH emergency numbers'
        />
      </SidebarGroup>

      <SidebarGroup title='Heritage'>
        <SidebarItem
          path='/discover/about#heritage'
          label='Heritage Sites'
          icon={LandmarkIcon}
          description='Historical landmarks'
        />
      </SidebarGroup>
    </SidebarContainer>
  );
}
