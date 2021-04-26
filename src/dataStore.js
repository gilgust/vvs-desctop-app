const Stora = require('electron-store');

export default class DataStore extends Stora {
    constructor(settings) {
        super(settings);
        
        this.todos = this.get('todos') || [];
    }

    saveTodos(){
        this.set('todos', this.todos);
        return this;
    }

    getTodos(){
        this.todos = this.get('todos') || [];    
        return this.todos;
    }

    addTodo(todo){
        this.todo = [...this.todos, todo];
        return this;
    }
    deleteTodo(todo){
        this.todos = this.todos.filter(t => t !== todo);
        return this.saveTodos();
    }
}

module.exports = DataStore;