import { MenuAppConfig } from '@taliferro/ui/platform/universal-menu.model';

/** Email Signature's part of the universal menu. */
export const PLATFORM_MENU_CONFIG: MenuAppConfig = {
  app: 'email-signature',
  name: 'Email Signature',
  items: [
    { label: 'Build a signature', icon: 'pen', route: '/' },
  ],
  secondaryItems: [
    { label: 'Help', icon: 'help', route: '/help' },
    { label: 'About', icon: 'info', route: '/about' },
  ],
};
