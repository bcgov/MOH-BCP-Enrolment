import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PractitionerAttachmentComponent } from './practitioner-attachment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedCoreModule } from 'moh-common-lib-angular';
import { RouterTestingModule } from '@angular/router/testing';

describe('PractitionerAttachmentComponent', () => {
  let component: PractitionerAttachmentComponent;
  let fixture: ComponentFixture<PractitionerAttachmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, RouterTestingModule, SharedCoreModule ],
      declarations: [ PractitionerAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PractitionerAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
