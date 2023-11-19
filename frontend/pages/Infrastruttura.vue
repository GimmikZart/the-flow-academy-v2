<template>
  <nuxt-layout name="app-layout">
    <!-- TOP BAR -->
    <section class="w-full h-[50px] bg-white mb-5 rounded-flow p-2 flex items-center justify-between">
      <TopBarLabel label="INFRASTRUTTURA"></TopBarLabel>
      <NuxtLink  to="/attivita">
        <Button size="small" severity="info" rounded class="mx-3 h-full">
          <Icon name="icon-park-solid:back" size="1rem" color="white"></Icon>
          <span class="ml-3">INDIETRO</span>
        </Button>
      </NuxtLink>
      
    </section>

    <!-- CONTENT -->
    <section class="w-full flex-grow rounded-flow p-5">
      <TabView>
          <TabPanel header="Attività">
            <DataTable :value="products" tableStyle="min-width: 50rem">
              <Column field="code" header="Code"></Column>
              <Column field="name" header="Name"></Column>
              <Column field="category" header="Category"></Column>
              <Column field="quantity" header="Quantity"></Column>
            </DataTable>
          </TabPanel>
          <TabPanel header="Categorie">
            <DataTable :value="products" tableStyle="min-width: 50rem">
              <Column field="code" header="Code"></Column>
              <Column field="name" header="Name"></Column>
              <Column field="category" header="Category"></Column>
              <Column field="quantity" header="Quantity"></Column>
            </DataTable>
          </TabPanel>
      </TabView>
      
      
    </section>
  </nuxt-layout>
</template>

<script setup>

</script>

<style scoped></style>