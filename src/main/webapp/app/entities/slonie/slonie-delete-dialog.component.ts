import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ISlonie } from 'app/shared/model/slonie.model';
import { SlonieService } from './slonie.service';

@Component({
    selector: 'jhi-slonie-delete-dialog',
    templateUrl: './slonie-delete-dialog.component.html'
})
export class SlonieDeleteDialogComponent {
    slonie: ISlonie;

    constructor(private slonieService: SlonieService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.slonieService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'slonieListModification',
                content: 'Deleted an slonie'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-slonie-delete-popup',
    template: ''
})
export class SlonieDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ slonie }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(SlonieDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.slonie = slonie;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
