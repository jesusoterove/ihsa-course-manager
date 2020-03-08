import { Attachment } from './attachment';

export interface Course {
    id?: number;
    name: string;
    startDate: Date;
    price: number;
    doc?: Attachment;
}
