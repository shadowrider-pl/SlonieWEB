/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SlonieWebTestModule } from '../../../test.module';
import { SlonieDetailComponent } from 'app/entities/slonie/slonie-detail.component';
import { Slonie } from 'app/shared/model/slonie.model';

describe('Component Tests', () => {
    describe('Slonie Management Detail Component', () => {
        let comp: SlonieDetailComponent;
        let fixture: ComponentFixture<SlonieDetailComponent>;
        const route = ({ data: of({ slonie: new Slonie(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SlonieWebTestModule],
                declarations: [SlonieDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(SlonieDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(SlonieDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.slonie).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
