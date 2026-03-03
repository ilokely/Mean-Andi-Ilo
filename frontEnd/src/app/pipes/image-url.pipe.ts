import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../environments/environment';

@Pipe({
    name: 'imageUrl',
    standalone: true
})
export class ImageUrlPipe implements PipeTransform {
    transform(path: string | null | undefined): string {
        if (!path) {
            return 'img/not-found.svg';
        }
        if (path.startsWith('img/')) {
            return path;
        }
        if (path.startsWith('/uploads/')) {
            return `${environment.apiUrl}${path}`;
        }
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        return path;
    }
}