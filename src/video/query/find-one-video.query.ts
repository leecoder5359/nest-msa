import { IQuery } from '@nestjs/cqrs';

export class FindOneVideoQuery implements IQuery {
    constructor(readonly id: string) {}
}
