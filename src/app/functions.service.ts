import { Injectable } from '@angular/core';

@Injectable()
export class FunctionsService {

  constructor() { }

  generateTime(){
    var now= new Date(),time=now.getTime(),
			expireTime=time+1000*36000000;
		now.setTime(expireTime);
		return now.toUTCString();
  }
  createSessionStorage(data){
    console.log(data,'DATAA')
    localStorage.setItem('user', JSON.stringify(data))
    console.log(localStorage.user)
    
  }
}
