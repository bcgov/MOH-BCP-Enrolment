import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPractitionerAttachmentComponent } from './review-practitioner-attachment.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReviewPractitionerAttachmentComponent', () => {
  let component: ReviewPractitionerAttachmentComponent;
  let fixture: ComponentFixture<ReviewPractitionerAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, RouterTestingModule ],
      declarations: [ ReviewPractitionerAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewPractitionerAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
