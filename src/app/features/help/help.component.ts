import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ProductPagesComponent } from '../../shared/product-pages/product-pages.component';

/** Email Signature's Help: the shared template, then the templates, the
 *  mail-app steps and tips below it. Static (prerendered). */
@Component( {
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, ProductPagesComponent],
  templateUrl: './help.component.html',
} )
export class HelpComponent {
  readonly templates = [
    { name: 'Clean', copy: 'Simple and readable. A safe choice for most people.' },
    { name: 'Centered', copy: 'More polished and presentation-like.' },
    { name: 'Sidebar', copy: 'Bolder, with a coloured rail down the left.' },
    { name: 'Minimal', copy: 'Quiet and understated.' },
    { name: 'Spotlight', copy: 'More visual, with stronger emphasis on who you are.' },
  ];

  readonly mailApps = [
    { app: 'Gmail', copy: 'Copy signature, then in Gmail open See all settings, scroll to Signature, create one, paste it and save.' },
    { app: 'Outlook', copy: 'Copy signature, open Outlook’s signature settings, create a new signature, paste it in and save.' },
    { app: 'Apple Mail', copy: 'Download HTML and open the file in Chrome. Select it all, copy, and paste it into a new signature in Mail > Settings > Signatures, with “Always match my default message font” turned off.' },
    { app: 'Yahoo Mail', copy: 'Copy signature, open More Settings then Writing email, turn the signature on and paste it.' },
  ];

  readonly tips = [
    { title: 'Use a square logo', copy: 'A square PNG with a transparent background looks best. Keep it under 2 MB.' },
    { title: 'One clear button', copy: 'If you add a button, make it one action, such as “Book a quick call”, with a link that works.' },
    { title: 'Send yourself a test', copy: 'Every mail app draws signatures a little differently. Send a test to check the logo, links and colours.' },
  ];

  readonly questions = [
    { q: 'Is anything I type saved?', a: 'No. Your details stay in this page. Only your logo is uploaded, so it can show in the people you email’s inboxes.' },
    { q: 'Why doesn’t my logo show for some people?', a: 'Some mail apps hold back images until the reader allows them. Your logo is hosted online so it appears once they do.' },
    { q: 'Can I edit the HTML?', a: 'Yes. Choose View HTML to see it, or Download HTML and edit the file before you paste it in.' },
    { q: 'Does it work on my phone?', a: 'You can build a signature on your phone. To add it to a mail app, it’s usually easiest on a computer.' },
  ];
}
