<template>
  <div id="app">
    <div class="wrapper-list">
    <h1 class="text-center">Lista de tareas</h1>
    <header>
      <input class="new-todo"
      v-model="newTodo"
      placeholder="¿Que necesitas hacer?"
      @keyup.enter="addTodo()">
    </header>
    <section>
      <ul class="todo-list">
        <li 
          v-for="todo in todos"
          :key="todo.id"
          :class="{editing: todo == editedTodo}">
          <div class="task-wrapper">
            <input class="toggle" type="checkbox" v-model="todo.completed">
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <div class="buttons-wrapper">
              <button class="edit" @click="editTodo(todo)">
                <b-icon icon="pencil-square"></b-icon>
              </button>
              <button 
                class="destroy"
                @click="removeTodo(todo)">
                <b-icon icon="dash-circle"></b-icon>
              </button>
            </div>
          </div>
          <input class="update" type="text"
            v-model="todo.title"
            @blur="doneEdit(todo)"
            @keyup.enter="doneEdit(todo)"
            >
        </li>
      </ul>
    </section>
    </div>
    <section class="add-edit-section">
        <h2>Agrega una tarea</h2>
        <div>
          <input class="new-todo"
            v-model="newTodo"
            placeholder="¿Que necesitas hacer?"
            @keyup.enter="addTodo()">
        </div>
        <div>
          <date-range-picker
            v-model="datePicker"
            :locale-data="{format: 'dd/mm/yyyy', daysOfWeek: daysOfWeekSpanish, applyLabel: 'Aplicar', cancelLabel: 'Cancelar'}"
            :ranges="false"
            opens="center"
            :single-date-picker="true">
          </date-range-picker>
        </div>
        <button @click="addTodo()">Agregar</button>
    </section>
  </div>
</template>

<script>
const STORAGE_KEY = 'todo-storage'
import DateRangePicker from 'vue2-daterange-picker'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
// import moment from 'moment'

export default {
  name: 'App',
  components:{
    DateRangePicker
  },
  data(){
    return{
      newTodo: '',
      todos:[],
      editedTodo: null,
      dbclicked: false,
      datePicker: {
        startDate: new Date(),
        endDate: new Date
      },
      daysOfWeekSpanish: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
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
      this.dbclicked = true
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
#app{
  min-height: 100vh;
  display: flex;
  input{
    padding: 0 16px;
  }
  .wrapper-list{
    border: 1px solid #000;
    width: 100%;
    @media(min-width: 992px){
      width: 600px;
    }
    header{
      input{
        width: 100%;
        height: 50px;
      }
    }
    ul{
      list-style: none;
      padding: 0 16px;
      li{
        border-bottom: 1px solid #828282;
        padding: 8px 0;
        position: relative;
        .task-wrapper{
          display: flex;
          .toggle{
            margin: auto 16px auto 0;
          }
          label{
            font-family: 'Roboto';
            font-size: 18px;
            margin: 0;
          }
          .buttons-wrapper{
            margin-left: auto;
            display: flex;
            button{
              margin: auto 0;
              background-color: #fff;
              border: none;
            }
          }
        }
        .update{
          display: none;
          position: absolute;
          top: 6px;
          left: 28px;
        }
        &.editing{
          input{
            display: block;
          }
        }
        &:last-child{
          border-bottom: 0;
        }
      }
    }
  }
}
</style>
