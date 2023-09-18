<template>
  <nuxt-layout name="app-layout">
    <!-- TOP BAR -->
    <section class="w-full h-[50px] bg-white mb-5 rounded-flow p-2 flex items-center justify-between">
      <TopBarLabel label="SOCIO"></TopBarLabel>
  
      <div class="flex items-center h-full top-tool-box">
      </div>
    </section>

    <!-- CONTENT -->
    <section v-if="client" class="w-full h-full flex-grow border-4 border-white rounded-flow overflow-auto p-3 flex">
      <!-- LEFT -->
      <div class="w-1/3 flex flex-col h-full">
        <!-- TOP -->
        <div class="flex items-center w-100">
          <!-- AVATAR -->
          <div class="w-[80px] h-[80px] flex justify-center items-center bg-gray rounded-full mr-10">
            <span class="text-3xl" v-if="!client.avatar && client.avatar == ''">{{ getInitials(client.name, client.surname) }}</span>
          </div>
          <!-- nome + cognome -->
          <h1 class="text-4xl font-bold">{{ client.name }} {{ client.surname }}</h1>
        </div>
        <!-- INFO -->
        <div class="w-100 h-full flex flex-col justify-between py-3">
          <!-- BOX -->
          <div class="bg-white w-full py-2 px-4 flex justify-between items-center rounded-lg my-3 h-full h-full">
            <h3 class="font-bold text-sm">Status</h3>
            <ClientsStatusLabel :clientStatus="client.status"></ClientsStatusLabel>
          </div>
          <div  class="bg-white w-full py-2 px-4 flex justify-between items-center rounded-lg my-3 h-full">
            <h3 class="font-bold text-sm">Sesso</h3>
            <Icon v-if="client.gender == true" name="icon-park-solid:boy-one" size="30" color="blue"></Icon>
            <Icon v-else name="icon-park-solid:girl-one" color="red" size="30"></Icon>
          </div>
          <div  class="bg-white w-full py-2 px-4 flex justify-between items-center rounded-lg my-3 h-full">
            <h3 class="font-bold text-sm">Email</h3>
            <span v-if="client.email && client.email != ''">{{ client.email }}</span>
            <span v-else> --- </span>
          </div>
          <div  class="bg-white w-full py-2 px-4 flex justify-between items-center rounded-lg my-3 h-full">
            <h3 class="font-bold text-sm">Telefono</h3>
            <span v-if="client.telephone && client.telephone != ''">{{ client.telephone }}</span>
            <span v-else> --- </span>
          </div>
          <div  class="bg-white w-full py-2 px-4 flex justify-between items-center rounded-lg my-3 h-full">
            <h3 class="font-bold text-sm">Data di nascita</h3>
            <span v-if="client.dateOfBirth && client.dateOfBirth != ''">{{ client.dateOfBirth }}</span>
            <span v-else> --- </span>
          </div>
          <div  class="bg-white w-full py-2 px-4 flex justify-between items-center rounded-lg my-3 h-full">
            <h3 class="font-bold text-sm">Indirizzo</h3>
            <span v-if="client.address && client.address != ''">{{ client.address }}</span>
            <span v-else> --- </span>
          </div>
          <div  class="bg-white w-full py-2 px-4 flex justify-between items-center rounded-lg my-3 h-full">
            <h3 class="font-bold text-sm">Primo contatto</h3>
            <span v-if="client.firstContact && client.firstContact != ''">{{ client.firstContact }}</span>
            <span v-else> --- </span>
          </div>
          <div  class="bg-white w-full py-2 px-4 rounded-lg my-3 h-full">
            <h3 class="font-bold text-sm">Misure</h3>
            <div class="flex justify-between items-center gap-2">
              <!-- CAPPELLO -->
              <div class="w-full border border-gray-200 border-solid p-2 rounded-lg">
                <Icon name="mingcute:hat-2-line"  size="30" class="mr-2"></Icon>
                <span v-if="client.sizes.head && client.sizes.head != ''">{{ client.sizes.head }}</span>
                <span v-else> --- </span>
              </div>
              <!-- T-SHIRT -->
              <div class="w-full border border-gray-200 border-solid p-2 rounded-lg">
                <Icon name="ion:shirt-outline"  size="30" class="mr-2"></Icon>
                <span v-if="client.sizes.shirt && client.sizes.shirt != ''">{{ client.sizes.shirt }}</span>
                <span v-else> --- </span>
              </div>
              <!-- PANTALONI -->
              <div class="w-full border border-gray-200 border-solid p-2 rounded-lg">
                <Icon name="ph:pants-thin"  size="30" class="mr-2"></Icon>
                <span v-if="client.sizes.pants && client.sizes.pants != ''">{{ client.sizes.pants }}</span>
                <span v-else> --- </span>
              </div>
              <!-- SCARPE -->
              <div class="w-full border border-gray-200 border-solid p-2 rounded-lg">
                <Icon name="mingcute:shoe-line"  size="30" class="mr-2"></Icon>
                <span v-if="client.sizes.shoes && client.sizes.shoes != ''">{{ client.sizes.shoes }}</span>
                <span v-else> --- </span>
              </div>
            </div>
          </div>
          <div  class="bg-white w-full py-2 px-4 rounded-lg my-3 h-full">
            <h3 class="font-bold text-sm">Note</h3>
            <Textarea class="w-full" :value="client.notes"></Textarea>
          </div>
        </div>
      </div>
      <!-- RIGHT -->
      <div class="w-2/3 h-full flex flex-col pl-10 py-10">
        <!-- ACTIVITIES -->
        <div class="border-2 border-white rounded-flow m-4 p-3 px-5 flex flex-col h-1/2 min-h-[350px]">
          <h1 class="text-center font-bold text-2xl">Attività</h1>
          <div class="h-full py-5 flex gap-3">
            <ActivityBox v-for="(activity, idx) in activitiesList" :key="idx" :activityInfo="activity"></ActivityBox>
          </div>
        </div>
        <!-- PAYMENTS -->
        <div class="border-2 border-white rounded-flow m-4 p-3 px-5 flex flex-col h-1/2 min-h-[350px]">
          <h1 class="text-center font-bold text-2xl">Pagamenti</h1>
          <div class="h-full py-5 flex gap-3">
            <PaymentsBox v-for="(payment, idx) in paymentsList" :key="idx" :activityInfo="payment"></PaymentsBox>
          </div>
        </div>
      </div>
    </section>
  </nuxt-layout>
</template>

<script setup>
  import { useFiltersStore } from "@/store/pill";
  import { ref, onBeforeMount  } from 'vue';
  const supabase = useSupabaseClient()
  const { getInitials, getAge } = utility()
  /* COMPOSABLES */
  const route = useRoute()
  const filtersStore = useFiltersStore()
  const { newErrorMessage } = filtersStore
  /* PROPS */
  const props = defineProps(['clientId'])

  const client = ref();
  const activitiesList = ref([
    { 
      title: "Titolo corso lungo e articolato da principiante",
      img: ""
    },
    { 
      title: "Titolo meno lungo",
      img: ""
    },
  ])

  const paymentsList = ref([
    { 
      title: "Titolo corso lungo e articolato da principiante",
      img: ""
    },
    { 
      title: "Titolo meno lungo",
      img: ""
    },
  ])

  const loadClient = async () => {
    try {
      let { data, error} = await supabase.from('clients').select('*').eq('id', route.params.id ).single();
      if(error) throw error
      client.value = data
    } catch (error) {
      newErrorMessage(`ERRORE NELL'AQUISIZIONE DI SOCI DAL DB: ${error.message}`)
    }
  } 

/* HOOKS */ 
  onBeforeMount(async () => {
    await loadClient()
  })     
</script>
<style>
.border-gray-200{
  border-color: rgb(229 231 235);
}
</style>