import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewCyclePage } from './new-cycle.page';

describe('NewCyclePage', () => {
  let component: NewCyclePage;
  let fixture: ComponentFixture<NewCyclePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCyclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
