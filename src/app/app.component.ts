import { Component } from '@angular/core';
import { EmailSignatureBuilderComponent } from './signature-builder/email-signature-builder.component';
import { CommandPaletteComponent } from './shared/page/command-palette/command-palette.component';
import { SiteFooterComponent } from './shared/site-footer/site-footer.component';
import { PlatformMenuComponent } from './shared/platform-menu/platform-menu.component';

@Component({
  selector: 'app-root',
  imports: [EmailSignatureBuilderComponent, CommandPaletteComponent, SiteFooterComponent, PlatformMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'email-signature-builder';
}
