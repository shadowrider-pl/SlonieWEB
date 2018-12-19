import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Slonie } from 'app/shared/model/slonie.model';
import { SlonieService } from './slonie.service';
import { SlonieComponent } from './slonie.component';
import { SlonieDetailComponent } from './slonie-detail.component';
import { SlonieUpdateComponent } from './slonie-update.component';
import { SlonieDeletePopupComponent } from './slonie-delete-dialog.component';
import { ISlonie } from 'app/shared/model/slonie.model';

@Injectable({ providedIn: 'root' })
export class SlonieResolve implements Resolve<ISlonie> {
    constructor(private service: SlonieService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Slonie> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Slonie>) => response.ok),
                map((slonie: HttpResponse<Slonie>) => slonie.body)
            );
        }
        return of(new Slonie());
    }
}

export const slonieRoute: Routes = [
    {
        path: 'slonie',
        component: SlonieComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'slonieWebApp.slonie.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'slonie/:id/view',
        component: SlonieDetailComponent,
        resolve: {
            slonie: SlonieResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'slonieWebApp.slonie.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'slonie/new',
        component: SlonieUpdateComponent,
        resolve: {
            slonie: SlonieResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'slonieWebApp.slonie.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'slonie/:id/edit',
        component: SlonieUpdateComponent,
        resolve: {
            slonie: SlonieResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'slonieWebApp.slonie.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const sloniePopupRoute: Routes = [
    {
        path: 'slonie/:id/delete',
        component: SlonieDeletePopupComponent,
        resolve: {
            slonie: SlonieResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'slonieWebApp.slonie.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
