import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ISlonie } from 'app/shared/model/slonie.model';
import { Principal } from 'app/core';
import { SlonieService } from './slonie.service';

@Component({
    selector: 'jhi-slonie',
    templateUrl: './slonie.component.html'
})
export class SlonieComponent implements OnInit, OnDestroy {
    slonies: ISlonie[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private slonieService: SlonieService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {}

    loadAll() {
        this.slonieService.query().subscribe(
            (res: HttpResponse<ISlonie[]>) => {
                this.slonies = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInSlonies();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ISlonie) {
        return item.id;
    }

    registerChangeInSlonies() {
        this.eventSubscriber = this.eventManager.subscribe('slonieListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
