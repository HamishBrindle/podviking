import { Location } from 'vue-router';

export type NavigationLink = {
  label: string;
  to: Location | null;
}

const links: NavigationLink[] = [
  {
    label: 'Shop',
    to: { name: 'shop' },
  },
  {
    label: 'About',
    to: { name: 'about' },
  },
  {
    label: 'Contact',
    to: { name: 'contact' },
  },
  {
    label: 'Licensing',
    to: { name: 'licensing' },
  },
];

export default links;
