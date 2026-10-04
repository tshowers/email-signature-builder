import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ProductPagesComponent } from '../../shared/product-pages/product-pages.component';

/** About Email Signature: the shared template, then why it exists and what
 *  it makes. Static (prerendered). */
@Component( {
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, ProductPagesComponent],
  templateUrl: './about.component.html',
} )
export class AboutComponent {
  readonly includes = [
    { title: 'Your details', copy: 'Name, title, company, phone, email, website and LinkedIn.' },
    { title: 'Your brand', copy: 'Your logo, an accent colour and a tagline.' },
    { title: 'An optional button', copy: 'One call to action, such as booking a call.' },
  ];
}
