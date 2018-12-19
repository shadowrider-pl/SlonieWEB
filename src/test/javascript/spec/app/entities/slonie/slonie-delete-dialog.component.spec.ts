/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { SlonieWebTestModule } from '../../../test.module';
import { SlonieDeleteDialogComponent } from 'app/entities/slonie/slonie-delete-dialog.component';
import { SlonieService } from 'app/entities/slonie/slonie.service';

describe('Component Tests', () => {
    describe('Slonie Management Delete Component', () => {
        let comp: SlonieDeleteDialogComponent;
        let fixture: ComponentFixture<SlonieDeleteDialogComponent>;
        let service: SlonieService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [SlonieWebTestModule],
                declarations: [SlonieDeleteDialogComponent]
            })
                .overrideTemplate(SlonieDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(SlonieDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(SlonieService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
