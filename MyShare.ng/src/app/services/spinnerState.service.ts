import { Injectable } from '@angular/core';

@Injectable()
export class SpinnerStateService {

    count: number = 0;

    show()
    {
        this.count++;   
    }
    hide()
    {
        if(this.count > 0)
        {
            this.count--; 
        }        
    }
}