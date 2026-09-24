import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { EmailSignatureBuilderComponent } from './signature-builder/email-signature-builder.component';

// AppComponent now renders its main content through <router-outlet>
// (previously a direct <app-email-signature-builder>), so these tests need
// a real Router to resolve the '' route, not just a bare TestBed.
describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'email-signature-builder' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('email-signature-builder');
  });

  it('should render the signature builder at the root route', async () => {
    const harness = await RouterTestingHarness.create();
    const routedComponent = await harness.navigateByUrl('/', EmailSignatureBuilderComponent);
    expect(routedComponent).toBeTruthy();
  });
});
