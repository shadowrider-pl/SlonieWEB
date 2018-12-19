import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ISlonie } from 'app/shared/model/slonie.model';

type EntityResponseType = HttpResponse<ISlonie>;
type EntityArrayResponseType = HttpResponse<ISlonie[]>;

@Injectable({ providedIn: 'root' })
export class SlonieService {
    public resourceUrl = SERVER_API_URL + 'api/slonies';

    constructor(private http: HttpClient) {}

    create(slonie: ISlonie): Observable<EntityResponseType> {
        return this.http.post<ISlonie>(this.resourceUrl, slonie, { observe: 'response' });
    }

    update(slonie: ISlonie): Observable<EntityResponseType> {
        return this.http.put<ISlonie>(this.resourceUrl, slonie, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ISlonie>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ISlonie[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
