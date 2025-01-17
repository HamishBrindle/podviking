import { AppAbilities } from '@/lib/types';
import { Location } from 'vue-router';

type NavigationLink = {
  title: string;
  action: string;
  to: Location | null;
  access?: AppAbilities;
  items?: Pick<NavigationLink, 'to'|'title'|'action'>[];
  divider?: boolean;
}

const links: NavigationLink[] = [
  {
    title: 'Home',
    action: 'mdi-home',
    to: { name: 'dashboard-home' },
  },
  {
    title: 'Settings',
    action: 'mdi-cog',
    to: { name: 'dashboard-settings' },
    divider: true,
  },
];

export default links;
