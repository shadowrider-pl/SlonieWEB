import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ISlonie } from 'app/shared/model/slonie.model';
import { SlonieService } from './slonie.service';

@Component({
    selector: 'jhi-slonie-update',
    templateUrl: './slonie-update.component.html'
})
export class SlonieUpdateComponent implements OnInit {
    slonie: ISlonie;
    isSaving: boolean;

    constructor(private slonieService: SlonieService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ slonie }) => {
            this.slonie = slonie;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.slonie.id !== undefined) {
            this.subscribeToSaveResponse(this.slonieService.update(this.slonie));
        } else {
            this.subscribeToSaveResponse(this.slonieService.create(this.slonie));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ISlonie>>) {
        result.subscribe((res: HttpResponse<ISlonie>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
}
