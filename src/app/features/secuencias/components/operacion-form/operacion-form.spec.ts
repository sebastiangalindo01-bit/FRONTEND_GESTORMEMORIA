import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperacionForm } from './operacion-form';

describe('OperacionForm', () => {
  let component: OperacionForm;
  let fixture: ComponentFixture<OperacionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperacionForm],
    }).compileComponents();

    fixture = TestBed.createComponent(OperacionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
