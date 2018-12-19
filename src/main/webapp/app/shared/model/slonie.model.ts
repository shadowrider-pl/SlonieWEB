export interface ISlonie {
    id?: number;
    plik?: string;
    wynik?: number;
}

export class Slonie implements ISlonie {
    constructor(public id?: number, public plik?: string, public wynik?: number) {}
}
