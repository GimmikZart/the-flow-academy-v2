<template>
  <nuxt-layout name="app-layout">
    <!-- TOP BAR -->
    <section class="w-full h-[50px] bg-white mb-5 rounded-flow p-2 flex items-center">
      <TopBarLabel label="DASHBOARD"></TopBarLabel>
    </section>

    <!-- CONTENT -->
    <section class="w-full flex-grow border-4 border-white rounded-flow p-5">
      <Button @click="testError()">TEST ERRORE</Button>
      <Button @click="testSuccess()">TEST SUCCESSO</Button>
    </section>
  </nuxt-layout>
</template>

<script setup>
import { useFiltersStore } from '~/store/pill'
import { storeToRefs } from 'pinia'

const filtersStore = useFiltersStore()
const { newSuccessMessage, newErrorMessage } = filtersStore

const testError = () => {
  newErrorMessage('ERRORE MANNAGGIA A DIO')
}

const testSuccess = () => {
  newSuccessMessage('EVVAI FUNZIONA MANNAGGIA A DIO')
}

</script>

<style scoped></style>