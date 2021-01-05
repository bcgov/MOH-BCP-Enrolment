import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { SubheadingReviewContainerComponent } from './subheading-review-container.component';

describe('SubheadingReviewContainerComponent', () => {
  let component: SubheadingReviewContainerComponent;
  let fixture: ComponentFixture<SubheadingReviewContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SubheadingReviewContainerComponent]
    })
    .compileComponents();
  }));

  it('should create', () => {
    fixture = TestBed.createComponent(SubheadingReviewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should navigate when redirect is called', () => {
    const router = TestBed.get(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(SubheadingReviewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.redirect('test');
    expect(router.navigate).toHaveBeenCalledWith(['test']);
  });
});
