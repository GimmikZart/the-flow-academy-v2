<template>
  <nuxt-layout name="app-layout">
    <!-- TOP BAR -->
    <section class="w-full h-[50px] bg-white mb-5 rounded-flow p-2 flex items-center">
      <TopBarLabel label="SOCI"></TopBarLabel>
    </section>

    <!-- CONTENT -->
    <section class="w-full flex-grow border-4 border-white rounded-flow overflow-hidden">
      <DataTable :value="clients" tableStyle="min-width: 50rem">
        <Column field="avatar" header="Avatar"></Column>
        <Column field="name" header="Nome"></Column>
        <Column field="surname" header="Cognome"></Column>
        <Column field="gender" header="Sesso"></Column>
        <Column field="dateOfBirth" header="Età"></Column>
        <Column field="activities" header="Iscrizioni">
          <template #body="slotProps">
            {{ slotProps.data.activities.length }}
          </template>
        </Column>
        <Column field="payments" header="Ultimo Pagamento">
          <template #body="slotProps">
            {{ slotProps.data.payments[slotProps.data.payments.length - 1].date }}
          </template>
        </Column>
        <Column field="status" header="Status"></Column>
        <Column field="action"  header="Azione"></Column>
      </DataTable>
    </section>
  </nuxt-layout>
</template>

<script setup>
  import { ref, onBeforeMount  } from 'vue';
  const { getClients } = getClientsApi() // auto-imported

  const clients = ref();

/* HOOKS */ 
  onBeforeMount(async () => {
    clients.value = await getClients();
    console.log(clients.value);
  })    
</script>

<style scoped></style>