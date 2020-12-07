import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataVizComponent } from './data-viz.component';

describe('DataVizComponent', () => {
  let component: DataVizComponent;
  let fixture: ComponentFixture<DataVizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataVizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataVizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
