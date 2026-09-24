import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureComponent } from './signature.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedCoreModule } from 'moh-common-lib-angular';

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
});
