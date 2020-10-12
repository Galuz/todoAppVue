<template>
    <div class="add-task-component">
        <h2>Agrega una tarea</h2>
        <div>
            <label for="">Escribe una tarea: </label>
            <input class="new-todo"
                v-model="data.newTodo"
                placeholder="¿Que necesitas hacer?">
        </div>
        <div>
            <label for="">Selecciona una fecha: </label>
            <date-range-picker
                v-model="data.datePicker"
                :locale-data="{format: 'dd/mm/yyyy', daysOfWeek: daysOfWeekSpanish, applyLabel: 'Aplicar', cancelLabel: 'Cancelar'}"
                :ranges="false"
                opens="center"
                :single-date-picker="true"
                :date-format="disabledDates"
                :autoApply="true">
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

<style lang="scss" scoped>
    .add-task-component{
        height: fit-content;
        border: 1px solid #838383;
        border-radius: 4px;

        padding: 16px;
        -webkit-box-shadow: 0px 7px 5px 0px rgba(0,0,0,0.51);
        -moz-box-shadow: 0px 7px 5px 0px rgba(0,0,0,0.51);
        box-shadow: 0px 7px 5px 0px rgba(0,0,0,0.51);
        >div{
            display: flex;
            flex-direction: column;
            margin-bottom: 16px;
            input{
                height: 40px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
        }
        >button{
            padding: 8px;
            background-color: #2F80ED;
            color: #fff;
            border: 0;
            border-radius: 4px;
        }
    }
</style>