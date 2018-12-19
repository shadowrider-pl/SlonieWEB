import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SlonieWebSharedModule } from 'app/shared';
import {
    SlonieComponent,
    SlonieDetailComponent,
    SlonieUpdateComponent,
    SlonieDeletePopupComponent,
    SlonieDeleteDialogComponent,
    slonieRoute,
    sloniePopupRoute
} from './';

const ENTITY_STATES = [...slonieRoute, ...sloniePopupRoute];

@NgModule({
    imports: [SlonieWebSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [SlonieComponent, SlonieDetailComponent, SlonieUpdateComponent, SlonieDeleteDialogComponent, SlonieDeletePopupComponent],
    entryComponents: [SlonieComponent, SlonieUpdateComponent, SlonieDeleteDialogComponent, SlonieDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SlonieWebSlonieModule {}
