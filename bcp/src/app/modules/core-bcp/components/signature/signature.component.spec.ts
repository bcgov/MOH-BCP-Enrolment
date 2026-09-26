import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureComponent } from './signature.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonImage, SharedCoreModule } from 'moh-common-lib-angular';
import { BCPDocumentTypes } from '../../models/documentTypes';

// Minimal valid 1x1 PNG. Loads successfully as an <img> src in a real
// browser so signature_pad's fromDataURL() promise resolves rather than
// rejects.
const SAMPLE_SIGNATURE_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

describe('SignatureComponent', () => {
  let component: SignatureComponent;
  let fixture: ComponentFixture<SignatureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ ModalModule.forRoot(), SharedCoreModule ],
      declarations: [ SignatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Regression for cs-91: a signature restored into the pad via open() ->
  // fromDataURL() must survive an Accept where the user never redraws.
  // Reproduces the "component already carries a signature from a previous
  // step (writeValue), user opens Sign to review it, presses Accept without
  // drawing" flow: `blankCanvas` starts at its declared default of `true`
  // and, pre-fix, is never told the restore put real content on the pad.
  it('keeps a restored signature after Accept when the user does not redraw', async () => {
    const restoredImage = new CommonImage<BCPDocumentTypes>(SAMPLE_SIGNATURE_DATA_URL);
    restoredImage.contentType = 'image/jpeg';
    restoredImage.documentType = BCPDocumentTypes.Signature;
    component.image = restoredImage;

    const signaturePad = (component as any).signaturePad;
    const fromDataURLSpy = spyOn(signaturePad, 'fromDataURL').and.callThrough();

    component.open();

    // open() fires the restore but does not expose the promise, so await
    // the spy's captured return value instead of guessing a timeout.
    await fromDataURLSpy.calls.mostRecent().returnValue;

    component.acceptModal();

    expect(component.image).not.toBeNull();
  });

  // Regression for cs-91: acceptModal() must not read blankCanvas until the
  // restore kicked off by open() has settled. This reproduces the reviewer's
  // race directly - open() then acceptModal() back to back, with nothing
  // awaited in between - rather than awaiting the restore first as the spec
  // above does. Pre-fix, acceptModal() reads the still-true blankCanvas left
  // over from open()'s synchronous reset and nulls the signature; the fix
  // makes acceptModal() await the same restore promise before deciding.
  it('keeps a restored signature when Accept is called before the restore settles', async () => {
    const restoredImage = new CommonImage<BCPDocumentTypes>(SAMPLE_SIGNATURE_DATA_URL);
    restoredImage.contentType = 'image/jpeg';
    restoredImage.documentType = BCPDocumentTypes.Signature;
    component.image = restoredImage;

    component.open();
    // No await between open() and acceptModal(): the restore triggered by
    // open() is still pending when acceptModal() is invoked.
    await component.acceptModal();

    expect(component.image).not.toBeNull();
  });

  // Regression for cs-91: a Clear that arrives while open()'s restore is
  // still in flight must win over that restore. Reproduces the reviewer's
  // third ordering - open() then clear() back to back, with nothing awaited
  // in between, so the fromDataURL() promise is still pending when clear()
  // runs - then Accept. Pre-fix, clear() sets blankCanvas true but the
  // restore's .then() lands afterwards and sets it back to false, so Accept
  // would submit the very signature the user just cleared.
  it('discards a restored signature when Clear arrives before the restore settles', async () => {
    const restoredImage = new CommonImage<BCPDocumentTypes>(SAMPLE_SIGNATURE_DATA_URL);
    restoredImage.contentType = 'image/jpeg';
    restoredImage.documentType = BCPDocumentTypes.Signature;
    component.image = restoredImage;

    component.open();
    // No await between open() and clear(): the restore triggered by open()
    // is still pending when clear() is invoked.
    component.clear();
    await component.acceptModal();

    expect(component.image).toBeNull();
  });
});
