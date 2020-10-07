<template>
  <div id="app">
    <header>
      <input class="new-todo"
      v-model="newTodo"
      @keyup.enter="addTodo()">
    </header>
    <section>
      <ul class="todo-list">
        <li 
          v-for="todo in todos"
          :key="todo.id"
          class="todo">
          <div>
            <input class="toggle" type="checkbox" v-model="todo.completed">
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button 
              class="destroy"
              @click="removeTodo(todo)">X</button>
          </div>
          <input class="update" type="text"
            v-model="todo.title"
            @blur="doneEdit(todo)"
            @keyup.enter="doneEdit(todo)">
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
const STORAGE_KEY = 'todo-storage'
export default {
  name: 'App',
  data(){
    return{
      newTodo: '',
      todos:[],
      editedTodo: ''
    }
  },
  mounted(){
    console.log("simon")
    this.todos = JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')
  },
  methods: {
    addTodo(){
      this.todos.push({title: this.newTodo, completed: 'false', id: this.todos.length})
      this.newTodo = ''
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
    },
    removeTodo(todo){
      this.todos.splice(this.todos.indexOf(todo), 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
    },
    editTodo(todo){
      this.editedTodo = todo;
    },
    doneEdit(todo){
      if(!this.editedTodo){
        return
      }
      this.editedTodo = null
      todo.title = todo.title.trim()
      if(!todo.title){
        this.removeTodo(todo)
      }
    }
  }
}
</script>

<style lang="scss">

</style>
