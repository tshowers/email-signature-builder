import { ProductPagesConfig } from '@taliferro/ui/platform/product-pages.model';

/** Email Signature's Help and About pages (the shared template). */
export const PRODUCT_PAGES_CONFIG: ProductPagesConfig = {
  key: 'email-signature',
  logo: 'assets/email-signature-logo.png',
  logoFill: true,
  openRoute: '/',
  // There's no app-wide menu here; each page draws its own Menu button.
  ownMenu: true,
};
