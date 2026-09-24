import { Routes } from '@angular/router';
import { EmailSignatureBuilderComponent } from './signature-builder/email-signature-builder.component';

export const routes: Routes = [
  { path: '', component: EmailSignatureBuilderComponent },
  {
    path: 'help',
    loadComponent: () => import('./features/help/help.component').then((m) => m.HelpComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent),
  },
];
