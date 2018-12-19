import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalService, Principal, Account } from 'app/core';
import { SlonieService } from '../entities/slonie';
import { ISlonie } from 'app/shared/model/slonie.model';
import { HttpErrorResponse, HttpResponse, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { SendFileToServerService } from './send-file-to-server.service';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    account: Account;
    modalRef: NgbModalRef;
    slonies: ISlonie[];
    eventSubscriber: Subscription;
    fileEventSubscriber: Subscription;
    currentFileUpload: File;
    selectedFiles: FileList;
    progress: { percentage: number } = { percentage: 0 };
    fileUploads: String[];

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private jhiAlertService: JhiAlertService,
        private sendFileToServerService: SendFileToServerService,
        private slonieService: SlonieService
    ) {}

    deleteFile(file) {
        const lastIndex = file.lastIndexOf('/');
        file = file.substring(lastIndex + 1);
        this.sendFileToServerService.delete(file).subscribe(response => {
            this.eventManager.broadcast({
                name: 'filesListModification',
                content: 'Deleted an file'
            });
        });
    }

    count(file) {
        const lastIndex = file.lastIndexOf('/');
        file = file.substring(lastIndex + 1);
        this.sendFileToServerService.count(file).subscribe(response => {
            this.eventManager.broadcast({
                name: 'slonieListModification',
                content: 'counted'
            });
        });
    }

    removeFilePath() {
        for (let i = 0; i < this.fileUploads.length; i++) {
            const lastIndex = this.fileUploads[i].lastIndexOf('/');
            this.fileUploads[i] = this.fileUploads[i].substring(lastIndex + 1);
        }
    }

    showFiles() {
        this.fileUploads = null;
        this.sendFileToServerService.getFiles().subscribe(
            (res: HttpResponse<String[]>) => {
                this.fileUploads = res.body;
                this.removeFilePath();
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    selectFile(event) {
        this.selectedFiles = event.target.files;
    }

    upload() {
        this.progress.percentage = 0;

        this.currentFileUpload = this.selectedFiles.item(0);
        this.sendFileToServerService.pushFileToStorage(this.currentFileUpload).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
                this.progress.percentage = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
                console.log('File is completely uploaded!');
                this.eventManager.broadcast({
                    name: 'filesListModification',
                    content: 'Added file'
                });
            }
        });

        this.selectedFiles = undefined;
        setTimeout(() => {
            this.currentFileUpload = null;
        }, 3000);
    }

    loadAll() {
        this.slonieService.query().subscribe(
            (res: HttpResponse<ISlonie[]>) => {
                this.slonies = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.principal.identity().then(account => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
        this.loadAll();
        this.showFiles();
        this.registerChangeInSlonies();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.principal.identity().then(account => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    registerChangeInSlonies() {
        this.eventSubscriber = this.eventManager.subscribe('slonieListModification', response => this.loadAll());
        this.fileEventSubscriber = this.eventManager.subscribe('filesListModification', response => this.showFiles());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
        this.eventManager.destroy(this.fileEventSubscriber);
    }

    trackId(index: number, item: ISlonie) {
        return item.id;
    }
}
