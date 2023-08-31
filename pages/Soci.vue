<template>
  <nuxt-layout name="app-layout">
    <!-- TOP BAR -->
    <section class="w-full h-[50px] bg-white mb-5 rounded-flow p-2 flex items-center justify-between">
      <TopBarLabel label="SOCI"></TopBarLabel>
      
      <span class="p-input-icon-left h-full w-2/6">
        <Icon name="ic:twotone-search" size="20px"/>
        <InputText v-model="clientFilter['global'].value" placeholder="Filtra soci" class="h-full w-full"/>
      </span>
      
      <div class="flex items-center h-full top-tool-box">
        <!-- <SelectButton v-model="actionMode" :options="actionsList" optionLabel="name" aria-labelledby="multiple">
        </SelectButton> -->
        <TopBarActionModes entity="clients" @change-action-mode="(newMode) => actionMode = newMode.value"></TopBarActionModes>
        <ClientsAddNewClient @saved="loadClientsList()"></ClientsAddNewClient>
      </div>
    </section>

    <!-- CONTENT -->
    <section class="w-full flex-grow border-4 border-white rounded-flow overflow-hidden">
      <DataTable :filters="clientFilter" filterDisplay="row" :globalFilterFields="['name', 'surname']" resizableColumns columnResizeMode="fit" :value="clients" tableStyle="min-width: 50rem" removableSort  stripedRows class="p-datatable-sm" sortMode="multiple">
        <Column field="avatar" header="Avatar">
          <template #body="slotProps">
            <Avatar v-if="slotProps.data.avatar" :image="slotProps.data.avatar" class="mr-2" size="large" shape="circle" />
            <Avatar v-else :label="getInitials(slotProps.data.name, slotProps.data.surname)" class="mr-2" size="large" shape="circle" />
          </template>
        </Column>
        <Column field="name" header="Nome" sortable ></Column>
        <Column field="surname" header="Cognome" sortable ></Column>
        <Column field="gender" header="Sesso" sortable >
          <template #body="slotProps">
            <Icon v-if="slotProps.data.gender == true" name="icon-park-solid:boy-one" color="blue" size="2rem"></Icon>
            <Icon v-else name="icon-park-solid:girl-one" color="red" size="2rem"></Icon>
          </template>
        </Column>
        <Column field="dateOfBirth" header="Età" sortable>
          <template #body="slotProps">
            {{ getAge(slotProps.data.dateOfBirth) }}
          </template>
          
        </Column>
        <!-- <Column field="activities" header="Iscrizioni" sortable >
          <template #body="slotProps">
            {{ slotProps.data.activities.length }}
          </template>
        </Column> -->
        <!-- <Column field="payments" header="Ultimo Pagamento" sortable >
          <template #body="slotProps">
            <span v-if="slotProps.data.payments.length > 0">{{ slotProps.data.payments[slotProps.data.payments.length - 1].date }}</span>
            <span v-else> --- </span>
          </template>
        </Column> -->
        <Column field="status" header="Status" sortable >
          <template #body="slotProps">
            <ClientsStatusLabel :clientStatus="slotProps.data.status"></ClientsStatusLabel>
          </template>
        </Column>
        <Column field="action"  header="Azione">
          <template #body="slotProps">
            <Button v-if="actionMode == 4" text>
              <Icon name="carbon:user-profile" size="2rem" color="brown"></Icon>
            </Button>
            
            <ClientsEditClient v-else-if="actionMode == 1" :clientId="slotProps.data.id" @saved="loadClientsList()"></ClientsEditClient>
            <ClientsRemoveClient v-else-if="actionMode == 2" :clientToRemove="slotProps.data" @saved="loadClientsList()"></ClientsRemoveClient>
            <ClientsAddNewPayment v-else-if="actionMode == 3 && slotProps.data.status != 2" :editingClient="slotProps.data" @saved="loadClientsList()"></ClientsAddNewPayment>
            
            
          </template>
        </Column>
      </DataTable>
    </section>
  </nuxt-layout>
</template>

<script setup>
import { useFiltersStore } from "@/store/pill";
  import { ref, onBeforeMount  } from 'vue';
  const supabase = useSupabaseClient()
  import { FilterMatchMode } from 'primevue/api';
  const { getInitials, getAge } = utility()
  /* COMPOSABLES */
  const filtersStore = useFiltersStore()
  const { newErrorMessage } = filtersStore

  const clients = ref();
  const actionMode = ref(4);
  const clientFilter= ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    surname: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
  })

  const loadClientsList = async () => {
    try {
      let { data, error} = await supabase.from('clients').select('*')
      if(error) throw error
      clients.value = data
    } catch (error) {
      newErrorMessage(`ERRORE NELL'AQUISIZIONE DI SOCI DAL DB: ${error.message}`)
    }
    
  }

/* HOOKS */ 
  onBeforeMount(async () => {
    loadClientsList()
  })    
</script>
