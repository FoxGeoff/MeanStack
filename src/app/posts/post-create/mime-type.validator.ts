import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
// import { AbstractControl } from '@angular/forms';

/* Promise is a generic type: JS obj => {} AND dynamic prop type read as string => [key: string] AND of type => :any */
export const mineType = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  const file = control.value as File;
  const fileReader = new FileReader();
  const fileReader$ = Observable.create((observer: Observer<{ [key: string]: any }>) => {
    /* sync version fileReader.onloadEnd() */
    fileReader.addEventListener('loadend', () => {

    });
    fileReader.readAsArrayBuffer(file);
  });
};
