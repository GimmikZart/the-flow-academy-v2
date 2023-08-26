import { defineNuxtPlugin } from "#app";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import Chip from 'primevue/chip';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';  

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: true });
  nuxtApp.vueApp.component("Button", Button);
  nuxtApp.vueApp.component("Password", Password);
  nuxtApp.vueApp.component("InputText", InputText);
  nuxtApp.vueApp.component("Chip", Chip);
  nuxtApp.vueApp.component("DataTable", DataTable);
  nuxtApp.vueApp.component("Column", Column);
  nuxtApp.vueApp.component("ColumnGroup", ColumnGroup);
  nuxtApp.vueApp.component("Row", Row);
})