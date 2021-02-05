import { Component, ViewChild, ViewEncapsulation, Optional, Self, AfterViewInit, Input } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { ModalDirective } from 'ngx-bootstrap';
import { NgControl } from '@angular/forms';
import { CommonImage } from 'moh-common-lib';
import { BCPDocumentTypes } from '../../models/documentTypes';

@Component({
  selector: 'bcp-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SignatureComponent implements AfterViewInit {
  showDemoError = false;

  @ViewChild(SignaturePad, { static: true }) signaturePad: SignaturePad;
  @ViewChild('signatureModal', { static: true }) public modal: ModalDirective;

  @Input() errorMessage: string = 'Signature is required';
  @Input() label: string = 'Add your signature';

  public image: CommonImage;
  private blankCanvas = true;

  public signaturePadOptions: object = { // passed through to szimek/signature_pad constructor
    canvasWidth: 500,
    canvasHeight: 200
  };

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
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.set('backgroundColor', 'white');
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  drawComplete() {
    this.blankCanvas = false;
  }


  clear() {
    this.signaturePad.clear();
    this.blankCanvas = true;
  }

  open() {
    this.modal.show();
    this.signaturePad.clear();
    if (this.image) {
      this.signaturePad.fromDataURL(this.image.fileContent);
    }
  }
  acceptModal() {
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
      this.signaturePad.fromDataURL(val);
    }
  }

  private createCommonImage(image): CommonImage<BCPDocumentTypes> {
    const common = new CommonImage<BCPDocumentTypes>(image);
    common.contentType = 'image/jpeg';
    common.documentType = BCPDocumentTypes.Signature;
    return common;
  }
}
