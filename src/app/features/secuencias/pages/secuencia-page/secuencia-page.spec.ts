import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecuenciaPage } from './secuencia-page';

describe('SecuenciaPage', () => {
  let component: SecuenciaPage;
  let fixture: ComponentFixture<SecuenciaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecuenciaPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SecuenciaPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
