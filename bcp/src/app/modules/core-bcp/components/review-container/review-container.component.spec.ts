import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { ReviewContainerComponent } from './review-container.component';
import { CoreBCPModule } from '../../core-bcp.module';

describe('ReviewContainerComponent', () => {
  let component: ReviewContainerComponent;
  let fixture: ComponentFixture<ReviewContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreBCPModule],
    })
    .compileComponents();
  }));

  it('should create', () => {
    fixture = TestBed.createComponent(ReviewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should navigate when redirect is called', () => {
    const router = TestBed.get(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(ReviewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.redirect('test');
    expect(router.navigate).toHaveBeenCalledWith(['test']);
  });
});
