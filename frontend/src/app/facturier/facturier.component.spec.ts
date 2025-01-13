import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturierComponent } from './facturier.component';

describe('FacturierComponent', () => {
  let component: FacturierComponent;
  let fixture: ComponentFixture<FacturierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
