<template>
  <div id="app">
    <div class="wrapper-list">
    <h1 class="text-center">Lista de tareas</h1>
    <header>
      <div class="tabs-filter">
        <button 
          @click="filterBy = 0"
          :class="filterBy === 0 ? 'active' : ''">Todas</button>
        <button 
          @click="filterBy = 1"
          :class="filterBy === 1 ? 'active' : ''">Completas</button>
        <button 
          @click="filterBy = 2"
          :class="filterBy === 2 ? 'active' : ''">Pendientes</button>
      </div>
    </header>
    <section>
      <ul class="todo-list">
        <li 
          v-for="todo in filteredtodos"
          :key="todo.id"
          :class="{completed: todo.completed, editing: todo == editedTodo && isGoingToEdit}">
          <div class="task-wrapper">
            <input class="toggle" type="checkbox" v-model="todo.completed" @change="checkboxOnChange()">
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
            :date-format="disabledDates"
            @update="updateDate(todo.id)">
          </date-range-picker>
        </li>
      </ul>
    </section>
    <button class="modal-trigger" v-b-modal.modal-add-task>
      <b-icon icon="plus-circle" class="modal-trigger-icon"></b-icon>
    </button>
    </div>
    <!-- mobile -->
    <b-modal id="modal-add-task" title="Agregar Tarea">
      <AddTask
        class="add-task"
        @AddTask="updateTask($event)">
      </AddTask>
    </b-modal>
    <!-- desktop -->
    <AddTask
      class="add-task"
      @AddTask="updateTask($event)">
    </AddTask>
  </div>
</template>

<script>
const STORAGE_KEY = 'todo-storage'
import DateRangePicker from 'vue2-daterange-picker'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import moment from 'moment'
import AddTask from '../src/components/AddTask'

export default {
  name: 'App',
  components:{
    DateRangePicker,
    AddTask
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
      isGoingToEdit: false,
      filterBy: 0, 
    }
  },
  mounted(){
    this.todos = JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')
    this.orderDates()
  },
  computed: {
    filteredtodos(){
      if(this.filterBy === 0){
        return this.todos
      }else if(this.filterBy === 2){
        return this.todos.filter(function(todo){
          return !todo.completed
        })
      }
      else{
        return this.todos.filter(function(todo){
          return todo.completed
        })
      }
    }
  },
  methods: {
    addTodo(){
      let expirationDate = moment(this.datePicker.startDate).utc()
      this.todos.push({title: this.newTodo, completed: 'false', id: this.todos.length, date: {startDate: expirationDate, endDate: expirationDate}})
      this.newTodo = ''
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
      this.orderDates()
    },
    removeTodo(todo){
      this.todos.splice(this.todos.indexOf(todo), 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
      this.orderDates()
    },
    editTodo(todo){
      this.editedTodo = todo;
      this.isGoingToEdit = !this.isGoingToEdit
      if(!this.isGoingToEdit){
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
        this.orderDates()
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
    checkboxOnChange(){
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
    },
    orderDates(){
      this.todos.sort(function(a,b){
        return new Date(a.date.startDate) - new Date(b.date.startDate);
      })
    },
    disabledDates(classes, date) {
      const dd = new Date().getDate()
      const mm = new Date().getMonth() + 1
      const yyyy = new Date().getFullYear()
      const today = `${yyyy}-${mm}-${dd}`
      const getCalendarDate = moment(date.getTime()).format()

      if (!classes.disabled) {
        classes.disabled = getCalendarDate < moment(today).format()
      }
      return classes
    },
    updateTask(task){
      this.newTodo = task.newTodo
      this.datePicker = task.datePicker
      this.addTodo()
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
  .modal-trigger{
    display: flex;
    @media(min-width: 992px){
      display: none;
    }
    position: absolute;
    right: 16px;
    bottom: 32px;

    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 0;
    background-color: #2F80ED;
    font-size: 32px;
    color: #fff;
    >.modal-trigger-icon{
      margin: auto;
    }
  }
  .wrapper-list{
    border: 1px solid #000;
    width: 100%;
    @media(min-width: 992px){
      width: 600px;
    }
    header{
      .tabs-filter{
        border: 1px solid #ccc;
        display: flex;
        height: 35px;
        border-radius: 4px;
        button{
          border: none;
          background-color: #fff;
          outline: none;
          color: #000015;
          width: calc(100% / 2);
          border-right: 1px solid #ccc;
          border-radius: 4px;
          &.active{
            background-color: #5B2AE0;
            color: white;
          }
          &:last-child{
            border-right: 0;
          }
        }
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
        &.completed{
          text-decoration: line-through;
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
  .add-task{
    display: none;
    @media(min-width: 992px){
      display: block;
    }
  }
}
</style>
