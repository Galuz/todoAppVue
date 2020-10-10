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
          :class="{editing: todo == editedTodo && isGoingToEdit}">
          <div class="task-wrapper">
            <input class="toggle" type="checkbox" v-model="todo.completed">
            <div class="text-wrapper">
              <label>{{ todo.title }}</label>
              <span> {{formatToDatePicker(todo.date.startDate)}} </span>
            </div>
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
          <input class="update-title" type="text"
            v-model="todo.title">
          <date-range-picker
            class="update-date"
            v-model="todo.date"
            :locale-data="{format: 'dd/mm/yyyy', daysOfWeek: daysOfWeekSpanish, applyLabel: 'Aplicar', cancelLabel: 'Cancelar'}"
            :ranges="false"
            opens="right"
            :single-date-picker="true"
            @update="updateDate(todo.id)">
          </date-range-picker>
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
import moment from 'moment'

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
      datePicker: {
        startDate: new Date(),
        endDate: new Date
      },
      daysOfWeekSpanish: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      isGoingToEdit: false
    }
  },
  mounted(){
    this.todos = JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')
  },
  methods: {
    addTodo(){
      let expirationDate = moment(this.datePicker.startDate).utc()
      this.todos.push({title: this.newTodo, completed: 'false', id: this.todos.length, date: {startDate: expirationDate, endDate: expirationDate}})
      this.newTodo = ''
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
    },
    removeTodo(todo){
      this.todos.splice(this.todos.indexOf(todo), 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
    },
    editTodo(todo){
      this.editedTodo = todo;
      this.isGoingToEdit = !this.isGoingToEdit
      if(!this.isGoingToEdit){
        console.log(this.todos)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
        console.log("guardado")
      }
    },
    updateDate(id){
      this.todos[id].date.startDate = moment(this.todos[id].date.startDate).utc()
      this.todos[id].date.endDate = moment(this.todos[id].date.endDate).utc()
    },
    formatToDatePicker(date) {
      return moment(date).format('DD/MM/YYYY')
    },
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
          .text-wrapper{
            display: flex;
            flex-direction: column;
            label{
              font-family: 'Roboto';
              font-size: 24px;
              margin: 0;
            }
            span{
              font-family: 'Roboto';
              font-size: 16px;
              color: #828282;
            }
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
        .update-title{
          display: none;
          position: absolute;
          top: 6px;
          left: 28px;
        }
        .update-date{
          display: none;
          position: absolute;
          bottom: 4px;
          left: 28px;
        }
        &.editing{
          input{
            display: block;
          }
          .update-date{
            display: inline-block;
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
