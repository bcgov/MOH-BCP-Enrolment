import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelChangeComponent } from './cancel-change.component';
import { CoreBCPModule } from '../../../core-bcp/core-bcp.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RestrictedTextareaComponent } from '../../components/restricted-textarea/restricted-textarea.component';

describe('CancelChangeComponent', () => {
  let component: CancelChangeComponent;
  let fixture: ComponentFixture<CancelChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CoreBCPModule, FormsModule, ReactiveFormsModule, RouterTestingModule ],
      declarations: [ CancelChangeComponent, RestrictedTextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
