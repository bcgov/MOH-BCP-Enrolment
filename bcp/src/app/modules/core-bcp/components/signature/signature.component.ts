import { Component, ViewChild, ElementRef, ViewEncapsulation, Optional, Self, AfterViewInit, OnDestroy, Input } from '@angular/core';
import SignaturePad from 'signature_pad';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgControl } from '@angular/forms';
import { CommonImage } from 'moh-common-lib-angular';
import { BCPDocumentTypes } from '../../models/documentTypes';

@Component({
  standalone: false,
  selector: 'bcp-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SignatureComponent implements AfterViewInit, OnDestroy {
  showDemoError = false;

  // Single source of truth for the pad's backing store size. Bound onto the
  // canvas in the template and passed to fromDataURL() so a restore always
  // draws at these dimensions regardless of devicePixelRatio.
  readonly canvasWidth = 500;
  readonly canvasHeight = 200;

  @ViewChild('signatureCanvas', { static: true }) signatureCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('signatureModal', { static: true }) public modal: ModalDirective;

  @Input() errorMessage = 'Signature is required';
  @Input() label = 'Add your signature';

  public image: CommonImage<BCPDocumentTypes>;
  private blankCanvas = true;
  private signaturePad: SignaturePad;
  // fromDataURL is asynchronous, so Accept has to wait for the restore to
  // settle before it reads blankCanvas. Resolved when no restore is pending.
  private restore: Promise<void> = Promise.resolve();
  // Bumped whenever the canvas state changes under a pending restore, so a
  // restore that lands after a Clear cannot report content the user removed.
  private restoreGeneration = 0;

  // Required for implementing ControlValueAccessor
  _onChange = (_: any) => { };
  _onTouched = (_?: any) => { };

  constructor(@Optional() @Self() public controlDir: NgControl) {
    // super();
    if (controlDir) {
      // console.log('sig controldir', controlDir);
      controlDir.valueAccessor = this;
    }
  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad = new SignaturePad(this.signatureCanvas.nativeElement, {
      minWidth: 5,
      backgroundColor: 'white',
    });
    this.signaturePad.addEventListener('endStroke', () => this.drawComplete());
  }

  ngOnDestroy(): void {
    this.signaturePad?.off();
  }

  drawComplete() {
    this.blankCanvas = false;
  }


  clear() {
    this.signaturePad.clear();
    this.blankCanvas = true;
    this.restoreGeneration++;
  }

  open() {
    this.modal.show();
    this.signaturePad.clear();
    this.blankCanvas = true;
    const generation = ++this.restoreGeneration;
    if (this.image) {
      // Explicit dimensions defeat signature_pad's devicePixelRatio division
      // (it only falls back to canvas.width / ratio when width/height are
      // omitted), so a restored signature always fills the pad.
      this.restore = this.signaturePad.fromDataURL(this.image.fileContent, {
        width: this.canvasWidth,
        height: this.canvasHeight,
      }).then(() => {
        // Restored strokes are real content, so Accept must keep them even
        // when the user never draws in this session. A Clear that arrived
        // while this was in flight bumped the generation and wins.
        if (generation === this.restoreGeneration) {
          this.blankCanvas = false;
        }
      }).catch(() => {
        // Malformed or legacy stored signature: leave the pad blank, so
        // Accept discards it and matches what the user sees.
      });
    } else {
      this.restore = Promise.resolve();
    }
  }
  async acceptModal() {
    // Accept can fire before a restore has landed. Reading blankCanvas any
    // earlier would discard a signature that is still being painted.
    await this.restore;
    if (!this.blankCanvas) {
      this.image = this.createCommonImage(this.signaturePad.toDataURL('image/jpeg'));
    } else {
      this.image = null;
    }

    this.modal.hide();
    this._onChange(this.image);
    this._onTouched();
  }

  cancelModal() {
    this.modal.hide();
    this._onTouched();
  }


  // Register change function
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  // Register touched function
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  writeValue(val: any): void {
    if (val) {
      this.image = val;
    }
  }

  private createCommonImage(image): CommonImage<BCPDocumentTypes> {
    const common = new CommonImage<BCPDocumentTypes>(image);
    common.contentType = 'image/jpeg';
    common.documentType = BCPDocumentTypes.Signature;
    return common;
  }
}
