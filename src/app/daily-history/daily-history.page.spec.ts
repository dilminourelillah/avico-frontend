import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyHistoryPage } from './daily-history.page';

describe('DailyHistoryPage', () => {
  let component: DailyHistoryPage;
  let fixture: ComponentFixture<DailyHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
