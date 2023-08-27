<template>
  <nuxt-layout name="app-layout">
    <!-- TOP BAR -->
    <section class="w-full h-[50px] bg-white mb-5 rounded-flow p-2 flex items-center justify-between">
      <TopBarLabel label="SOCI"></TopBarLabel>
      <div>
        <ClientsAddNewClient @saved="loadClientsList()"></ClientsAddNewClient>
      </div>
      
    </section>

    <!-- CONTENT -->
    <section class="w-full flex-grow border-4 border-white rounded-flow overflow-hidden">
      <DataTable resizableColumns columnResizeMode="fit" :value="clients" tableStyle="min-width: 50rem" removableSort  stripedRows class="p-datatable-sm" sortMode="multiple">
        <Column field="avatar" header="Avatar">
          <template #body="slotProps">
            <Avatar v-if="slotProps.data.avatar != ''" :image="slotProps.data.avatar" class="mr-2" size="large" shape="circle" />
            <Avatar v-else :label="getInitials(slotProps.data.name, slotProps.data.surname)" class="mr-2" size="large" shape="circle" />
          </template>
        </Column>
        <Column field="name" header="Nome" sortable ></Column>
        <Column field="surname" header="Cognome" sortable ></Column>
        <Column field="gender" header="Sesso" sortable >
          <template #body="slotProps">
            <Icon v-if="slotProps.data.gender == true" name="icon-park-solid:boy-one" color="blue"></Icon>
            <Icon v-else name="icon-park-solid:girl-one" color="red"></Icon>
          </template>
        </Column>
        <Column field="dateOfBirth" header="Età" sortable>
          <template #body="slotProps">
            {{ getAge(slotProps.data.dateOfBirth) }}
          </template>
          
        </Column>
        <Column field="activities" header="Iscrizioni" sortable >
          <template #body="slotProps">
            {{ slotProps.data.activities.length }}
          </template>
        </Column>
        <Column field="payments" header="Ultimo Pagamento" sortable >
          <template #body="slotProps">
            <span v-if="slotProps.data.payments.length > 0">{{ slotProps.data.payments[slotProps.data.payments.length - 1].date }}</span>
            <span v-else> --- </span>
          </template>
        </Column>
        <Column field="status" header="Status" sortable >
          <template #body="slotProps">
            <ClientsStatusLabel :clientStatus="slotProps.data.status"></ClientsStatusLabel>
          </template>
        </Column>
        <Column field="action"  header="Azione">
          <template #body="slotProps">
            <ClientsAddNewPayment :editingClient="slotProps.data"></ClientsAddNewPayment>
            <!-- <Button text rounded color="green" size="1rem" @click="addPayment(slotProps.data)">
              <Icon name="ph:hand-coins" size="2rem" color="green"></Icon>
            </Button> -->
          </template>
        </Column>
      </DataTable>
    </section>

    
    <!-- <Dialog v-if="addPaymentDialog" :visible="addPaymentDialog" modal :header="`Pagamento da ${editClient.value.name} ${editClient.value.surname}`" :style="{ width: '50vw' }">
      <span class="p-float-label col-span-2">
          <Calendar v-model="props.newClient.firstContact" placeholder="Primo Contatto" dateFormat="dd/mm/yy" class="w-full"/>
          <label>Primo Contatto</label>
        </span>
    </Dialog> -->
  </nuxt-layout>
</template>

<script setup>
  import { ref, onBeforeMount  } from 'vue';
  const { getClients } = getClientsApi() // auto-imported
  const { getInitials, getAge } = utility()

  const clients = ref();
  const addPaymentDialog = ref(false);
  const editClient = reactive({value: null})

  const loadClientsList = async () => {
    clients.value = await getClients();
  }

  const addPayment = (client) => {
    editClient.value = client
    addPaymentDialog.value = true
  }
/* HOOKS */ 
  onBeforeMount(async () => {
    loadClientsList()
  })    
</script>
