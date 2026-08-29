import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

type PlatformKey = 'gmail' | 'outlook' | 'apple-mail' | 'yahoo';
type TemplateKey = 'clean' | 'centered' | 'sidebar' | 'minimal' | 'spotlight';

interface PlatformGuide {
  key: PlatformKey;
  label: string;
  steps: string[];
}

@Component( {
  selector: 'app-email-signature-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './email-signature-builder.component.html',
  styleUrl: './email-signature-builder.component.css',
} )
export class EmailSignatureBuilderComponent {
  private readonly fb = inject( FormBuilder );
  private readonly http = inject( HttpClient );
  private readonly platformId = inject( PLATFORM_ID );
  private readonly isBrowser = isPlatformBrowser( this.platformId );

  readonly form = this.fb.nonNullable.group( {
    fullName: ['Jane Doe', [Validators.required]],
    title: ['Founder', [Validators.required]],
    company: ['Taliferro Tech', [Validators.required]],
    phone: ['(425) 555-0199'],
    email: ['jane@taliferro.tech', [Validators.email]],
    website: ['taliferro.tech'],
    linkedin: ['linkedin.com/in/janedoe'],
    tagline: ['Built for momentum.'],
    includeCta: [true],
    ctaLabel: ['Book a quick call'],
    ctaUrl: ['https://calendly.com/example/demo'],
    accentColor: ['#0f766e', [Validators.required]],
    template: ['clean' as TemplateKey, [Validators.required]],
  } );

  readonly templates: Array<{ key: TemplateKey; label: string; description: string; }> = [
    { key: 'clean', label: 'Clean', description: 'Simple and readable.' },
    { key: 'centered', label: 'Centered', description: 'More polished and presentation-like.' },
    { key: 'sidebar', label: 'Sidebar', description: 'Bolder with a visual left rail.' },
    { key: 'minimal', label: 'Minimal', description: 'Quiet and understated.' },
    { key: 'spotlight', label: 'Spotlight', description: 'More visual with stronger emphasis on identity.' },
  ];

  readonly colorPresets = ['#0f766e', '#0f4c81', '#b45309', '#be123c', '#4338ca', '#111827'];

  readonly platformGuides: PlatformGuide[] = [
    {
      key: 'gmail',
      label: 'Gmail',
      steps: [
        'Click Copy HTML or Download HTML.',
        'Open Gmail and choose See all settings.',
        'Scroll to Signature and create a new signature.',
        'Paste the signature and save changes.',
      ],
    },
    {
      key: 'outlook',
      label: 'Outlook',
      steps: [
        'Click Copy HTML or Download HTML.',
        'Open Outlook signature settings.',
        'Create a new signature and paste it in.',
        'Save and send yourself a test email.',
      ],
    },
    {
      key: 'apple-mail',
      label: 'Apple Mail',
      steps: [
        'Build your signature and click Download HTML.',
        'Open the downloaded HTML file in Google Chrome.',
        'In Chrome, press Command+A to select the entire rendered signature, then press Command+C to copy it.',
        'Open Apple Mail and go to Mail > Settings > Signatures.',
        'Choose your email account and create a new signature.',
        'Uncheck “Always match my default message font.”',
        'Click inside the Apple Mail signature editor and paste the copied signature.',
        'Send yourself a test email to verify the formatting, logo, and links.',
      ],
    },
    {
      key: 'yahoo',
      label: 'Yahoo Mail',
      steps: [
        'Click Copy HTML.',
        'Open More Settings then Writing email.',
        'Enable the signature and paste it.',
        'Send a test email to confirm it looks right.',
      ],
    },
  ];

  activePlatform: PlatformKey = 'gmail';
  copyMessage = '';
  uploadedLogoDataUrl = '';
  uploadedLogoName = '';
  uploadedLogoHostedUrl = '';
  uploadInFlight = false;
  isDragActive = false;
  uploadMessage = '';

  get selectedTemplateLabel (): string {
    return this.templates.find( item => item.key === this.form.controls.template.value )?.label ?? 'Clean';
  }

  get selectedTemplateDescription (): string {
    return this.templates.find( item => item.key === this.form.controls.template.value )?.description ?? '';
  }

  get initials (): string {
    return this.form.controls.fullName.value
      .split( ' ' )
      .map( part => part.trim().charAt( 0 ) )
      .filter( Boolean )
      .slice( 0, 2 )
      .join( '' )
      .toUpperCase() || 'TD';
  }

  get previewLinks (): string[] {
    const value = this.form.getRawValue();
    return [
      this.sanitizeSignatureText( value.phone ),
      this.sanitizeSignatureText( value.email ),
      this.sanitizeSignatureText( value.website ),
      this.sanitizeSignatureText( value.linkedin ) ? 'LinkedIn' : '',
    ].filter( Boolean );
  }

  get codeSnippet (): string {
    return this.buildHtml();
  }

  get showCta (): boolean {
    return this.form.controls.includeCta.value
      && !!this.form.controls.ctaLabel.value.trim()
      && !!this.form.controls.ctaUrl.value.trim();
  }

  get activeGuide (): PlatformGuide {
    return this.platformGuides.find( guide => guide.key === this.activePlatform ) ?? this.platformGuides[0];
  }

  choosePreset ( color: string ): void {
    this.form.controls.accentColor.setValue( color );
  }

  onLogoSelected ( event: Event ): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if ( !file ) return;
    void this.processLogoFile( file );
  }

  removeLogo (): void {
    this.uploadedLogoDataUrl = '';
    this.uploadedLogoName = '';
    this.uploadedLogoHostedUrl = '';
    this.uploadMessage = '';
    this.copyMessage = 'Logo removed.';
  }

  onDragOver ( event: DragEvent ): void {
    event.preventDefault();
    this.isDragActive = true;
  }

  onDragLeave ( event: DragEvent ): void {
    event.preventDefault();
    this.isDragActive = false;
  }

  onDrop ( event: DragEvent ): void {
    event.preventDefault();
    this.isDragActive = false;
    const file = event.dataTransfer?.files?.[0];
    if ( file ) {
      void this.processLogoFile( file );
    }
  }

  async copyHtml (): Promise<void> {
    if ( !this.isBrowser || !navigator?.clipboard?.writeText ) {
      this.copyMessage = 'Clipboard is not available here.';
      return;
    }

    try {
      await navigator.clipboard.writeText( this.codeSnippet );
      this.copyMessage = 'HTML copied.';
    } catch {
      this.copyMessage = 'Copy failed.';
    }
  }

  downloadHtml (): void {
    if ( !this.isBrowser ) return;

    const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Signature</title>
</head>
<body>
${this.codeSnippet}
</body>
</html>`;

    const blob = new Blob( [htmlDocument], { type: 'text/html;charset=utf-8' } );
    const url = window.URL.createObjectURL( blob );
    const anchor = document.createElement( 'a' );
    anchor.href = url;
    anchor.download = 'email-signature.html';
    anchor.click();
    window.URL.revokeObjectURL( url );
    this.copyMessage = 'HTML downloaded.';
  }

  private buildHtml (): string {
    const value = this.form.getRawValue();
    const accent = value.accentColor;
    const fullName = this.escapeHtml( this.sanitizeSignatureText( value.fullName ) );
    const title = this.escapeHtml( this.sanitizeSignatureText( value.title ) );
    const company = this.escapeHtml( this.sanitizeSignatureText( value.company ) );
    const phone = this.escapeHtml( this.sanitizeSignatureText( value.phone ) );
    const email = this.escapeHtml( this.sanitizeSignatureText( value.email ) );
    const website = this.escapeHtml( this.sanitizeSignatureText( value.website ) );
    // Inserted block
    const rawPhone = this.sanitizeSignatureText( value.phone );
    const rawEmail = this.sanitizeSignatureText( value.email );
    const rawWebsite = this.sanitizeSignatureText( value.website );
    const rawLinkedin = this.sanitizeSignatureText( value.linkedin );
    const phoneHref = rawPhone ? `tel:${this.escapeAttribute( rawPhone.replace( /[^\d+]/g, '' ) )}` : '';
    const emailHref = rawEmail ? `mailto:${this.escapeAttribute( rawEmail )}` : '';
    const websiteHref = rawWebsite
      ? this.escapeAttribute( /^(https?:)?\/\//i.test( rawWebsite ) ? rawWebsite : `https://${rawWebsite}` )
      : '';
    const linkedinHref = rawLinkedin
      ? this.escapeAttribute( /^(https?:)?\/\//i.test( rawLinkedin ) ? rawLinkedin : `https://${rawLinkedin}` )
      : '';
    // End inserted block
    const tagline = this.escapeHtml( this.sanitizeSignatureText( value.tagline ) );
    const ctaLabel = this.escapeHtml( this.sanitizeSignatureText( value.ctaLabel ) );
    const ctaUrl = this.escapeAttribute( this.sanitizeSignatureText( value.ctaUrl ) );
    const links = [
      phone ? ( phoneHref ? `<a href="${phoneHref}" style="color:#334155;text-decoration:none;">${phone}</a>` : phone ) : '',
      email ? ( emailHref ? `<a href="${emailHref}" style="color:#334155;text-decoration:none;">${email}</a>` : email ) : '',
      website ? ( websiteHref ? `<a href="${websiteHref}" style="color:#334155;text-decoration:none;">${website}</a>` : website ) : '',
      rawLinkedin ? ( linkedinHref ? `<a href="${linkedinHref}" style="color:#334155;text-decoration:none;">LinkedIn</a>` : 'LinkedIn' ) : '',
    ].filter( Boolean ).join( ' | ' );
    const ctaHtml = this.showCta
      ? `<div style="padding-top:14px;"><a href="${ctaUrl}" style="display:inline-block;padding:10px 16px;border-radius:999px;background:${accent};color:#ffffff;text-decoration:none;font-size:11px;font-weight:700;">${ctaLabel}</a></div>`
      : '';

    const logoSrc = this.uploadedLogoHostedUrl || this.uploadedLogoDataUrl;
    const avatarHtml = logoSrc
      ? `<img src="${this.escapeAttribute( logoSrc )}" alt="Logo" style="width:64px;height:64px;border-radius:16px;object-fit:contain;background:#ffffff;padding:8px;border:1px solid #e2e8f0;" />`
      : `<div style="width:64px;height:64px;border-radius:999px;background:${accent};color:#ffffff;font-size:24px;font-weight:800;line-height:64px;text-align:center;">${this.initials}</div>`;

    const templates: Record<TemplateKey, string> = {
      clean: `
<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <tr>
    <td style="padding-right:16px;vertical-align:top;">${avatarHtml}</td>
    <td style="vertical-align:top;">
      <div style="font-size:18px;font-weight:800;">${fullName}</div>
      <div style="padding-top:4px;font-size:12px;color:${accent};font-weight:700;">${title}</div>
      <div style="padding-top:2px;font-size:12px;color:#475569;">${company}</div>
      <div style="padding-top:10px;font-size:11px;color:#334155;">${links}</div>
      <div style="padding-top:10px;font-size:11px;color:#64748b;">${tagline}</div>
      ${ctaHtml}
    </td>
  </tr>
</table>`.trim(),
      centered: `
<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;color:#111827;text-align:center;">
  <tr><td style="padding-bottom:12px;">${avatarHtml}</td></tr>
  <tr><td style="font-size:20px;font-weight:800;">${fullName}</td></tr>
  <tr><td style="padding-top:4px;font-size:12px;color:${accent};font-weight:700;">${title} | ${company}</td></tr>
  <tr><td style="padding-top:10px;font-size:11px;color:#334155;">${links}</td></tr>
  <tr><td style="padding-top:10px;font-size:11px;color:#64748b;">${tagline}</td></tr>
  <tr><td>${ctaHtml}</td></tr>
</table>`.trim(),
      sidebar: `
<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;color:#111827;border-left:6px solid ${accent};padding-left:16px;">
  <tr>
    <td style="padding-right:16px;vertical-align:top;">${avatarHtml}</td>
    <td style="vertical-align:top;">
      <div style="font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${accent};font-weight:800;">${company}</div>
      <div style="padding-top:6px;font-size:20px;font-weight:800;">${fullName}</div>
      <div style="padding-top:4px;font-size:12px;color:#475569;">${title}</div>
      <div style="padding-top:10px;font-size:11px;color:#334155;">${links}</div>
      <div style="padding-top:10px;font-size:11px;color:#64748b;">${tagline}</div>
      ${ctaHtml}
    </td>
  </tr>
</table>`.trim(),
      minimal: `
<table cellpadding="0" cellspacing="0" border="0" style="font-family:Georgia,Times New Roman,serif;color:#111827;">
  <tr><td style="font-size:24px;font-weight:700;">${fullName}</td></tr>
  <tr><td style="padding-top:6px;font-size:13px;color:#475569;">${title} at ${company}</td></tr>
  <tr><td style="padding-top:12px;font-size:11px;color:#334155;">${links}</td></tr>
  <tr><td style="padding-top:12px;font-size:11px;color:#64748b;font-style:italic;">${tagline}</td></tr>
  <tr><td>${ctaHtml}</td></tr>
</table>`.trim(),
      spotlight: `
<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <tr>
    <td style="padding:18px 18px 18px 0;vertical-align:top;">${avatarHtml}</td>
    <td style="vertical-align:top;">
      <div style="font-size:22px;font-weight:800;">${fullName}</div>
      <div style="padding-top:6px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${accent};font-weight:800;">${title}</div>
      <div style="padding-top:4px;font-size:13px;color:#475569;">${company}</div>
      <div style="margin-top:12px;padding:10px 12px;border-radius:14px;background:#f8fafc;font-size:11px;color:#334155;">${links}</div>
      <div style="padding-top:10px;font-size:11px;color:#64748b;">${tagline}</div>
      ${ctaHtml}
    </td>
  </tr>
</table>`.trim(),
    };

    return templates[value.template];
  }

  private sanitizeSignatureText ( value: string ): string {
    return String( value || '' )
      .replace( /[\u202A-\u202E\u2066-\u2069]/g, '' )
      .replace( /[\u200B-\u200D\uFEFF]/g, '' )
      .replace( /\u00A0/g, ' ' )
      .trim();
  }

  private escapeHtml ( value: string ): string {
    return value
      .replace( /&/g, '&amp;' )
      .replace( /</g, '&lt;' )
      .replace( />/g, '&gt;' )
      .replace( /"/g, '&quot;' )
      .replace( /'/g, '&#39;' );
  }

  private escapeAttribute ( value: string ): string {
    return this.escapeHtml( value );
  }

  private async processLogoFile ( file: File ): Promise<void> {
    if ( !file.type.startsWith( 'image/' ) ) {
      this.copyMessage = 'Please choose an image file.';
      return;
    }

    this.uploadedLogoName = file.name;
    this.uploadedLogoDataUrl = await this.readFileAsDataUrl( file );
    this.uploadedLogoHostedUrl = '';
    this.uploadMessage = '';
    this.copyMessage = 'Logo loaded.';

    try {
      this.uploadInFlight = true;
      const response = await firstValueFrom(
        this.http.post<{ assetUrl: string; }>( `${environment.backendURL}/public/signature-assets`, {
          fileName: file.name,
          dataUrl: this.uploadedLogoDataUrl,
        } )
      );

      this.uploadedLogoHostedUrl = String( response?.assetUrl || '' ).trim();
      if ( this.uploadedLogoHostedUrl ) {
        this.copyMessage = 'Logo uploaded and ready to use in exported signatures.';
        this.uploadMessage = this.uploadedLogoHostedUrl;
      }
    } catch {
      this.copyMessage = 'Logo loaded locally. Export will include the uploaded logo, but hosted delivery was unavailable.';
      this.uploadMessage = '';
    } finally {
      this.uploadInFlight = false;
    }
  }

  private readFileAsDataUrl ( file: File ): Promise<string> {
    return new Promise( ( resolve, reject ) => {
      const reader = new FileReader();
      reader.onload = () => resolve( typeof reader.result === 'string' ? reader.result : '' );
      reader.onerror = () => reject( new Error( 'Unable to read file.' ) );
      reader.readAsDataURL( file );
    } );
  }

}
