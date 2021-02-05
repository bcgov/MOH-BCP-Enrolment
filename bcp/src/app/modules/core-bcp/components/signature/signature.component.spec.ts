import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureComponent } from './signature.component';
import { ModalModule } from 'ngx-bootstrap';
import { SharedCoreModule } from 'moh-common-lib';
import { SignaturePadModule } from 'angular2-signaturepad';

describe('SignatureComponent', () => {
  let component: SignatureComponent;
  let fixture: ComponentFixture<SignatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ModalModule.forRoot(), SharedCoreModule, SignaturePadModule ],
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
});
