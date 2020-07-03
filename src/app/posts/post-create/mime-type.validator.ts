import { AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
// import { AbstractControl } from '@angular/forms';

/* Promise is a generic type: JS obj => {} AND dynamic prop type read as string => [key: string] AND of type => :any */
export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  const file = control.value as File;
  const fileReader = new FileReader();
  const fileReader$ = Observable.create((observer: Observer<{ [key: string]: any }>) => {
    /* sync version fileReader.onloadEnd() */
    fileReader.addEventListener('loadend', () => {
      /* read the binary blob and extract the meme type */
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      /* build hex decimal string */
      let header = '';
      let isValid = false;

      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }
      /* we are checking image file types */
      switch (header) {
        case '89504e47':
          isValid = true;
          break;
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          isValid = true;
          break;
        default:
          isValid = false; // or you can use the blob.type as fallback
          break;
      }

      if (isValid) {
        observer.next(null); // good result
      } else {
        observer.next({ invalidMimeType: true });
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);
  });
  return fileReader$;
};
