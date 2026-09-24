import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../../shared/seo.service';

interface HelpStep {
  number: string;
  title: string;
  copy: string;
  details: string[];
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css',
})
export class HelpComponent implements OnInit {
  constructor(
    private readonly title: Title,
    private readonly meta: Meta,
    private readonly seo: SeoService,
  ) {}

  ngOnInit(): void {
    const pageTitle = 'Help — Email Signature Builder';
    const description = 'How to use Email Signature Builder: pick a template, fill in your details, then copy or download the HTML for Gmail, Outlook, Apple Mail, or Yahoo Mail.';
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: 'https://signature.taliferro.tech/help' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.seo.setCanonical('https://signature.taliferro.tech/help');
  }

  readonly steps: HelpStep[] = [
    {
      number: '01',
      title: 'Pick a template',
      copy: 'Choose the layout that fits your style — the preview updates live as you type.',
      details: [
        'Clean — simple and readable.',
        'Centered — more polished and presentation-like.',
        'Sidebar — bolder, with a visual left rail.',
        'Minimal — quiet and understated.',
        'Spotlight — more visual, stronger emphasis on identity.',
      ],
    },
    {
      number: '02',
      title: 'Fill in your details',
      copy: 'Name, title, company, phone, email, website, and LinkedIn all feed directly into the preview.',
      details: [
        'Add a tagline, and optionally a call-to-action button with its own label and link.',
        'Pick an accent color to match your brand.',
      ],
    },
    {
      number: '03',
      title: 'Copy or download the HTML',
      copy: 'Once it looks right, get the signature out of the tool and into your email client.',
      details: [
        'Copy HTML puts it on your clipboard, ready to paste directly into most signature editors.',
        'Download HTML saves a file — needed for Apple Mail (see below) or if you want to keep a copy.',
      ],
    },
    {
      number: '04',
      title: 'Paste it into your email client',
      copy: 'Exact steps vary by platform — the tool shows the right ones once you\'ve built your signature.',
      details: [
        'Gmail, Outlook, and Yahoo Mail: copy the HTML and paste it directly into that platform\'s signature settings.',
        'Apple Mail needs one extra step: download the HTML, open it in Chrome, select and copy the rendered signature (not the file), then paste into Mail > Settings > Signatures.',
        'Always send yourself a test email afterward to confirm the formatting, logo, and links came through.',
      ],
    },
  ];
}
