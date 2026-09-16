import { TagItem } from './../../shared/models/todo.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subscription, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { TodoItem } from 'app/shared/models/todo.model';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Todo, TodoTag } from 'app/shared/inmemory-db/todo';


@Injectable({
  providedIn: 'root'
})
export class TodoService {

  searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
  sub: Subscription;

  constructor(private http: HttpClient) {
  }

  getTodoList() {
    return of(Todo.todoList)
    // return this.http.get("/api/todoList");
  }

  getTodoById(id) {
    return of(Todo.todoList.find(todo => todo.id === +id));
    // return this.http.get("/api/todoList/"+id);
  }

  getTagList() {
    return of(TodoTag.tag);
    // return this.http.get("/api/todoTag");
  }

  updateSearchTerm(term: string) {
    this.searchTerm.next(term);
  }

  getSearchTerm() {
    return this.searchTerm;
  }

  saveTag(tag: TagItem) {
    let newTag: TagItem = {
      id: Math.floor(Math.random() * 9000) + 1000,
      ...tag
    }
    TodoTag.tag.push(newTag);
    return of(TodoTag.tag)
    // return this.http.post("/api/todoTag/",tag);
  }

  deleteTag(tag: TagItem) {
    let filteredTag = TodoTag.tag.filter(t => t.id !== +tag.id);
    TodoTag.tag = [...filteredTag];
    return of(TodoTag.tag);
    // this.http.delete("/api/todoTag/" + tag.id).subscribe(e => { });
  }

  deleteTodo(todo: TodoItem) {
    let filteredTodo = Todo.todoList.filter(t => t.id !== +todo.id);
    Todo.todoList = [...filteredTodo];
    return of(Todo.todoList);
    // return this.http.delete("/api/todoList/" + todo.id);
  }

  updateTodo(todo: TodoItem) {

    let updatedTodo;
    todo.selected = false;

    if (!todo.id) {
      todo.id = Math.floor(Math.random() * 9000) + 1000;
      Todo.todoList.push(todo);
      // updatedTodo = todo;
      // updatedTodo = this.http.post("/api/todoList/", todo);
    }
    else {
      Todo.todoList.map(t => {
        if(t.id === +todo.id) {
          return {...todo}
        }
        return t;
      });
      // updatedTodo = this.http.put("/api/todoList/" + todo.id, todo);
    }

    return of(todo);
  }
}
