import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable()
export class HttpService {
  constructor(private _http: HttpClient) { 
  
  }

  getTasks(){
    console.log('Getting All Tasks')
    return this._http.get('/tasks');
  }

  getOneTask(reqTask) {
    console.log("Getting one task");
    let pStr = "/tasks/" + reqTask['id']
    console.log("str: ", pStr)
    return this._http.get(pStr);
    // tmpObs.subscribe(data => console.log('Got one task', data));   
  }

  createTask(newTask) {
    return this._http.post('/tasks', newTask)
  }

  updateTask(newTask) {
    let pStr = "/tasks/" + newTask['id']
    console.log("str: ", pStr)
    return this._http.put(pStr, newTask);
  }

  deleteTask(newTask) {
    let pStr = "/tasks/" + newTask['id']
    console.log("str: ", pStr)
    return this._http.delete(pStr, newTask);
  }
}
