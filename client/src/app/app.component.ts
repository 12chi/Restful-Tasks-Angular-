import { Component, OnInit } from '@angular/core';
import { HttpService } from './http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tasks = [];
  reqTask = {id: "", name: "", desc: "", done: null};
  newTask = {name: "", desc: "", done: null};
  updating = false;
  updTask = {id: ""};

  ngOnInit() {
    this.getAllTasks();
    console.log('init task: ', this.tasks)
  }

  constructor (private _httpService: HttpService) {}

  getAllTasks(): void {
    console.log("get all tasks")
    let tsks = this._httpService.getTasks();
    tsks.subscribe(data => {
      this.tasks = data['data'];
      console.log("tasks: ", this.tasks)
    });
  }

  getOneTask(event): void{
    this.reqTask.id = event.target.value;
    let Obs = this._httpService.getOneTask(this.reqTask);
    Obs.subscribe(data => {
      console.log('Got one task', data);
      this.reqTask.name = data['data']['name'];
      this.reqTask.desc = data['data']['desc'];
      this.reqTask.done = data['data']['done'];
    });
  }

  createTask(): void {
    let Obs = this._httpService.createTask(this.newTask);
    Obs.subscribe(data => {
      if (data['message'] == 'Success') {
        console.log('Successfully create task', data);
        this.newTask.name="";
        this.newTask.desc="";
      } else {
        console.log('Error: Create Task', data['error']);
      }
    });
    this.getAllTasks();
  }

  updateTask(): void {
    let Obs = this._httpService.updateTask(this.reqTask);
    Obs.subscribe(data => {
      console.log('Update task', data);
      if (data['message'] == 'Success') {
        this.updating = false;
        this.reqTask.name = "";
        this.reqTask.desc = "";
        this.reqTask.done = "";
      } else {
        console.log("Error during update", data['error']);
      }
    });
    this.getAllTasks();
  } 

  editTask(event): void {
    this.reqTask.id = event.target.value;
    console.log('edit: ', this.reqTask.id)
    let Obs = this._httpService.getOneTask(this.reqTask);
    Obs.subscribe(data => {
      if (data['message']=='Success') {
        console.log('Got one task', data);
        this.reqTask.name = data['data']['name'];
        this.reqTask.desc = data['data']['desc'];
        this.reqTask.done = data['data']['done'];
        this.updating = true;
      } else {
        console.log('Error: Retrieving Task Details', data['error']);
      }
    });
  }

  deleteTask(event): void {
    this.reqTask.id = event.target.value;
    let Obs = this._httpService.deleteTask(this.reqTask);
    Obs.subscribe(data => {
    if (data['message'] == 'Success') {
      console.log("Successfully deleted task", this.reqTask.id);
    } else {
      console.log("Error: deleting task", data['error']);
    }
    });
    this.getAllTasks();
  }
  
}