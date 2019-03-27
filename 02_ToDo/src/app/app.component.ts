import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { isSyntheticPropertyOrListener } from '@angular/compiler/src/render3/util';

interface ITodoItem {
  id: number;
  assignedTo?: string;
  description: string;
  dueDate?: Date;
  done?: boolean
}

interface IPerson {
  name: string;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {

  clickCountForMe: number = 0;
  clickCount: number = 0;
  filtered: ITodoItem[] = [];
  todos: ITodoItem[] = [];
  people: IPerson[] = [];
  displayedColumns: string[] = ['id','assignedTo','description','dueDate','done', "edit"];

  constructor(private http: HttpClient, public dialog: MatDialog){
    this.loadTodos();
    this.loadPeople();
    
  }

  /*
    1.) Add 'import { HttpClientModule } from '@angular/common/http';' to the app.module.ts file
    2.) Add 'import { HttpClient } from '@angular/common/http';' to the app.component.ts file
    3.) Create an Interface of what the webservice sends back
    4.) Create a method that calls the webservice and asigns it to a variable
    5.) Implement code in html so it gets displayed
  */
  async loadTodos(){
    this.todos = await this.http.get<ITodoItem[]>('http://localhost:8081/api/todos').toPromise();
    this.filtered = this.todos;
    console.log(this.todos);
  }
  loadTodosWOA(){
    this.http.get<ITodoItem[]>('http://localhost:8081/api/todos').subscribe(rsl => {
      this.todos = rsl;
    });
  }

  async loadPeople(){
    this.people = await this.http.get<IPerson[]>('http://localhost:8081/api/people').toPromise();
    console.log(this.people);
  }

  async delete(td: ITodoItem){
    await this.http.delete('http://localhost:8081/api/todos/'+td.id).subscribe(result => {
      this.loadTodos();
    });
  }
  async setdone(td: ITodoItem){
    console.log("Current status: "+td.done)
    const todo = this.todos.find(i => i.id == td.id);
    todo.done = !todo.done;
    td.done = !td.done;
    await this.http.patch('http://localhost:8081/api/todos/'+td.id, {id: td.id, description: td.description, dueDate: td.dueDate, done: !td.done}).toPromise().then(e => {
      this.loadTodosWOA();
    });
  }

  showDone(): void{
    this.loadTodosWOA();
   if(this.clickCount%2!==0){
      console.log("Show!");
      this.filtered = [];
      this.todos.forEach(element => {
        if(element.done === true){
          this.filtered.push(element);
        }
      });
    }else{
      this.filtered = this.todos;
    }
    this.clickCount++;
  }

  showForMe(): void{
    if(this.clickCountForMe%2!==0){
      this.filtered = [];
      this.todos.forEach(element => {
        if(element.assignedTo.includes("Me")){
          this.filtered.push(element);
        }
      })
    }else{
      this.filtered = this.todos;
    }
    this.clickCountForMe++;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateToDoDialog, {
      width: '250px',
      height: '400px',
      data: {persons: this.people}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTodos();
    });
  }

  editDialog(td: ITodoItem): void {
    const dialogRef = this.dialog.open(CreateToDoDialog, {
      width: '250px',
      height: '400px',
      data: {persons: this.people, todo: td}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTodos();
    });
  }
}

export interface DialogData {
  persons: IPerson[];
  todo: ITodoItem;
}

@Component({
  selector: 'createDialog',
  templateUrl: 'createDialog.html',
})
export class CreateToDoDialog {

people: IPerson[] = [];
description: string = "";
selected: string = "";
date = new FormControl(new Date());

mode: number = 0;

  constructor(
    public dialogRef: MatDialogRef<CreateToDoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient) {
      if(data.todo){
        this.description = data.todo.description;
        this.selected = data.todo.assignedTo;
        this.date.setValue(data.todo.dueDate);
        this.mode = 1;
        this.people = this.data.persons;
      }else{
        this.people = this.data.persons;
        this.mode = 0;
      }
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onClick(){
    if(this.mode === 0){
      await this.http.post("http://localhost:8081/api/todos", {description: this.description, assignedTo: this.selected, dueDate: this.date.value, done: false}).toPromise();
    }else if(this.mode === 1){
      await this.http.patch("http://localhost:8081/api/todos/"+this.data.todo.id, {id: this.data.todo.id, description: this.description, assignedTo: this.selected, dueDate: this.date.value, done: false}).toPromise();
    }
    this.dialogRef.close();
  }

}
