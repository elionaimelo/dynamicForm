/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import DateFnsAdapter from '@date-io/date-fns'
import ptBr from 'date-fns/locale/pt-BR'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  date: {
    adapter: new DateFnsAdapter(),
    locale: { 'pt-BR': ptBr },
  },
})
