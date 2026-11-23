import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecuenciaList } from './secuencia-list';

describe('SecuenciaList', () => {
  let component: SecuenciaList;
  let fixture: ComponentFixture<SecuenciaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecuenciaList],
    }).compileComponents();

    fixture = TestBed.createComponent(SecuenciaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
