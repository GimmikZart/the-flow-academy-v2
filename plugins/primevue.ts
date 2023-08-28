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
import Dialog from 'primevue/dialog'; 
import Calendar from 'primevue/calendar';
import ToggleButton from 'primevue/togglebutton';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';
import InputNumber from 'primevue/inputnumber';
import MultiSelect from 'primevue/multiselect';
import Textarea from 'primevue/textarea';
import SelectButton from 'primevue/selectbutton';

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
  nuxtApp.vueApp.component("Dialog", Dialog);
  nuxtApp.vueApp.component("Calendar", Calendar);
  nuxtApp.vueApp.component("ToggleButton", ToggleButton);
  nuxtApp.vueApp.component("Avatar", Avatar);
  nuxtApp.vueApp.component("Tag", Tag);
  nuxtApp.vueApp.component("InputNumber", InputNumber);
  nuxtApp.vueApp.component("MultiSelect", MultiSelect);
  nuxtApp.vueApp.component("Textarea", Textarea);
  nuxtApp.vueApp.component("SelectButton", SelectButton);

})