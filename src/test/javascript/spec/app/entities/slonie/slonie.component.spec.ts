/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { SlonieWebTestModule } from '../../../test.module';
import { SlonieComponent } from 'app/entities/slonie/slonie.component';
import { SlonieService } from 'app/entities/slonie/slonie.service';
import { Slonie } from 'app/shared/model/slonie.model';

describe('Component Tests', () => {
    describe('Slonie Management Component', () => {
        let comp: SlonieComponent;
        let fixture: ComponentFixture<SlonieComponent>;
        let service: SlonieService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SlonieWebTestModule],
                declarations: [SlonieComponent],
                providers: []
            })
                .overrideTemplate(SlonieComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(SlonieComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SlonieService);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                of(
                    new HttpResponse({
                        body: [new Slonie(123)],
                        headers
                    })
                )
            );

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.slonies[0]).toEqual(jasmine.objectContaining({ id: 123 }));
        });
    });
});
