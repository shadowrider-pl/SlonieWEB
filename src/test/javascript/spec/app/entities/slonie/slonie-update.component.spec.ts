/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { SlonieWebTestModule } from '../../../test.module';
import { SlonieUpdateComponent } from 'app/entities/slonie/slonie-update.component';
import { SlonieService } from 'app/entities/slonie/slonie.service';
import { Slonie } from 'app/shared/model/slonie.model';

describe('Component Tests', () => {
    describe('Slonie Management Update Component', () => {
        let comp: SlonieUpdateComponent;
        let fixture: ComponentFixture<SlonieUpdateComponent>;
        let service: SlonieService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SlonieWebTestModule],
                declarations: [SlonieUpdateComponent]
            })
                .overrideTemplate(SlonieUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(SlonieUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SlonieService);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity', fakeAsync(() => {
                // GIVEN
                const entity = new Slonie(123);
                spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.slonie = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.update).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));

            it('Should call create service on save for new entity', fakeAsync(() => {
                // GIVEN
                const entity = new Slonie();
                spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                comp.slonie = entity;
                // WHEN
                comp.save();
                tick(); // simulate async

                // THEN
                expect(service.create).toHaveBeenCalledWith(entity);
                expect(comp.isSaving).toEqual(false);
            }));
        });
    });
});
