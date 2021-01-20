import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniListItemComponent } from './mini-list-item.component';

describe('MiniListItemComponent', () => {
  let component: MiniListItemComponent;
  let fixture: ComponentFixture<MiniListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiniListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
