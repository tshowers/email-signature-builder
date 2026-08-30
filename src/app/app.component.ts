import { Component } from '@angular/core';
import { EmailSignatureBuilderComponent } from './signature-builder/email-signature-builder.component';

@Component({
  selector: 'app-root',
  imports: [EmailSignatureBuilderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'email-signature-builder';
  readonly year = new Date().getFullYear();
}
