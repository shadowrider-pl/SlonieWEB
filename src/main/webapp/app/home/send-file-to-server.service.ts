import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';

type EntityResponseType = HttpEvent<{}>;
type EntityArrayResponseType = HttpResponse<String[]>;

@Injectable({ providedIn: 'root' })
export class SendFileToServerService {
    public resourceUrl = SERVER_API_URL + 'api/slonie-files';
    public resourceUrlCount = SERVER_API_URL + 'api/count';

    constructor(private http: HttpClient) {}

    pushFileToStorage(file: File): Observable<EntityResponseType> {
        const formdata: FormData = new FormData();

        formdata.append('file', file);

        const req = new HttpRequest('POST', this.resourceUrl, formdata, {
            reportProgress: true,
            responseType: 'text'
        });

        return this.http.request(req);
    }

    getFiles(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<String[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(file: string): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${file}`, { observe: 'response' });
    }

    count(file: string): Observable<HttpResponse<any>> {
        return this.http.get<any>(`${this.resourceUrlCount}/${file}`, { observe: 'response' });
    }
}
