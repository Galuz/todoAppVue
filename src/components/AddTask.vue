<template>
    <div>
        <h2>Agrega una tarea</h2>
        <div>
          <input class="new-todo"
            v-model="data.newTodo"
            placeholder="¿Que necesitas hacer?">
        </div>
        <div>
          <date-range-picker
            v-model="data.datePicker"
            :locale-data="{format: 'dd/mm/yyyy', daysOfWeek: daysOfWeekSpanish, applyLabel: 'Aplicar', cancelLabel: 'Cancelar'}"
            :ranges="false"
            opens="center"
            :single-date-picker="true"
            :date-format="disabledDates">
          </date-range-picker>
        </div>
        <button @click="onClick()">Agregar</button>
    </div>
</template>

<script>
import DateRangePicker from 'vue2-daterange-picker'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import moment from 'moment'

export default {
    name: 'AddTask',
    components:{
        DateRangePicker
    },
    data(){
        return {
            data:{
                newTodo: '',
                datePicker: {
                    startDate: new Date(),
                    endDate: new Date
                }
            },
            daysOfWeekSpanish: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
        }
    },
    methods: {
        onClick(){
            this.$emit('AddTask', this.data)
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
    }
}
</script>

<style>

</style>