import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISlonie } from 'app/shared/model/slonie.model';

@Component({
    selector: 'jhi-slonie-detail',
    templateUrl: './slonie-detail.component.html'
})
export class SlonieDetailComponent implements OnInit {
    slonie: ISlonie;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ slonie }) => {
            this.slonie = slonie;
        });
    }

    previousState() {
        window.history.back();
    }
}
