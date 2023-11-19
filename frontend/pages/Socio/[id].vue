<template>
  <nuxt-layout name="app-layout">
    <!-- TOP BAR -->
    <section class="w-full h-[50px] bg-white mb-5 rounded-flow p-2 flex items-center justify-between">
      <TopBarLabel label="SOCIO"></TopBarLabel>
  
      <div class="flex items-center h-full top-tool-box">
        <TopBarActionModes entity="activity" @change-action-mode="(newMode) => actionMode = newMode.value"></TopBarActionModes>
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
          <ClientsEditClient v-if="isEditMode" :client-id="client.id" class="ml-auto"></ClientsEditClient>
          <ClientsRemoveClient v-if="isRemoveMode" :client-to-remove="client" class="ml-auto" @saved="loadClient()"></ClientsRemoveClient>
        </div>
        <!-- INFO -->
        <SocioInfoSection :client="client"></SocioInfoSection>
      </div>
      <!-- RIGHT -->
      <div class="w-2/3 h-full flex flex-col pl-10">
        <!-- ACTIVITIES -->
        <SocioCardSection card-name="Attività" class="h-2/5">
          <template #button>
            <Button text @click="addActivityDialog = true; getActivitiesList()">
                <template #icon>
                  <Icon name="zondicons:add-outline" color="green" size="30"></Icon>
                </template>
            </Button>
          </template>
          <template #cards>
            <ActivityBox v-for="(activity, idx) in activitiesList" :key="idx" :activityInfo="activity" :edit-mode="isEditMode" :remove-mode="isRemoveMode" @handled="loadClient();"></ActivityBox>
          </template>
        </SocioCardSection>
        <!-- PAYMENTS -->
        <SocioCardSection card-name="Pagamenti" class="h-3/5">
          <template #button>
            <Button text @click="addPayment()">
                <template #icon>
                  <Icon name="zondicons:add-outline" color="green" size="30"></Icon>
                </template>
            </Button>
          </template>
          <template #cards>
            <PaymentsBox v-for="(payment, idx) in paymentsList" :key="idx" :paymentInfo="payment" :clientInfo="client" :edit-mode="isEditMode" :remove-mode="isRemoveMode" @edited="loadClient()"></PaymentsBox>
          </template>
        </SocioCardSection>
      </div>>
    </section>

    <!-- DIALOGS -->
    <PaymentsHandleDialog v-if="client" :user="client" :user-type="userTypes.CLIENT" :visible="handlePaymentDialog" @save="savePayment()" @close="handlePaymentDialog = false"></PaymentsHandleDialog>

    <Dialog :visible="addActivityDialog" modal header="Iscrivi ad attività" :style="{ minWidth: '20vw' }">
      <Dropdown class="w-full" v-model="selectedNewActivity" :options="allActivities">
        <template #value="slotProps">
          <div v-if="slotProps.value" class="flex align-items-center">
            <span class="font-bold">{{ slotProps.value.name }}</span>
            <span class="mx-2">|</span>
            <Chip class="bg-flow-brown text-white">{{ slotProps.value.level }}</Chip>
          </div>
        </template>
        <template #option="slotProps">
          <div class="flex align-items-center">
            <span class="font-bold">{{ slotProps.option.name }}</span>
            <span class="mx-2">|</span>
            <Chip class="bg-flow-brown text-white">{{ slotProps.option.level }}</Chip>
          </div>
        </template>
      </Dropdown>
      <template #footer>
        <Button text label="Annulla" @click="addActivityDialog = false" severity="info" />
        <Button text label="Iscrivi"  @click="addActivity()" severity="success"/>
      </template>
    </Dialog>
  </nuxt-layout>
</template>

<script setup>
  import { usePillNotify } from "@/store/pill";
  import { ref, onBeforeMount, computed  } from 'vue';
  import ClientInstance from "@/assets/entities/clientInstance"
  import { usePaymentStore } from "@/store/payments";
  import { userTypes } from "assets/enums/UserType";
  const supabase = useSupabaseClient()
  const { getInitials, getAge, reloadApp } = utility()
  /* COMPOSABLES */
  const route = useRoute()
  const pillNotify = usePillNotify()
  const { newSuccessMessage, newErrorMessage } = pillNotify
  /* PROPS */
  const props = defineProps(['clientId'])
  /* STORES */
  const paymentStore = usePaymentStore()

  /* DATA */
  const client = ref();
  const activitiesList = ref([])
  const paymentsList = ref([])
  const actionMode = ref(4)
  const addActivityDialog = ref(false)
  const allActivities = ref([])
  const selectedNewActivity = ref()
  const handlePaymentDialog = ref(false)

  /* COMPUTED */
  const isVisitMode = computed(() => actionMode.value == 4);
  const isEditMode = computed(() => actionMode.value == 1);
  const isRemoveMode = computed(() => actionMode.value == 2);
  /* METHODS */
  const loadClient = async () => {
    client.value = await getClient()
    activitiesList.value = await getInstances()
    paymentsList.value = await getPayments()
  } 

  const getClient = async () => {
    try {
      let { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', route.params.id)
        .single();
      if(error) throw error
      return data
    } catch (error) {
      newErrorMessage(`ERRORE NELL'AQUISIZIONE DEL SOCIO DAL DB: ${error.message}`)
    }
  }

  const getPayments = async () => {
    try {
      let { data, error } = await supabase
        .from('payments')
        .select('*, instances(name, level, id)')
        .eq('client_id', route.params.id)
        .order('id', { ascending: false });
      if(error) throw error
      return data
    } catch (error) {
      newErrorMessage(`ERRORE NELL'AQUISIZIONE DEI PAGAMENTI DEL SOCIO: ${error.message}`)
    }
  }

  const getInstances = async () => {
    try {
      let { data, error } = await supabase
        .from('client_instance')
        .select('*, instances ( name, level )')
        .eq('client_id', parseInt(route.params.id));
      if(error) throw error
      return data
    } catch (error) {
      newErrorMessage(`ERRORE NELL'AQUISIZIONE DELLE ATTIVITA' DEL SOCIO: ${error.message}`)
    }
  }
  
  const getActivitiesList = async () => {
    try {
      let { data, error } = await supabase
        .from('instances')
        .select('id, name, level')
      if(error) throw error
      allActivities.value = data
    } catch (error) {
      newErrorMessage(`ERRORE NELL'AQUISIZIONE DELLA LISTA COMPLESSIVA DELLE ATTIVITA': ${error.message}`)
    }
    
  }

  const addActivity = async () => {
    let newActivity = new ClientInstance(client.value.id, selectedNewActivity.value.id) 
    try {
      let { error } = await supabase
        .from('client_instance')
        .insert(newActivity)
      if(error) throw error
      newSuccessMessage(`${client.value.name} ${client.value.surname} è stato iscritto a ${selectedNewActivity.value.name}`);
      loadClient()
    } catch (error) {
      newErrorMessage(`ERRORE NELL'ISCRIZIONE ALL'ATTIVITA': ${error.message}`)
    } finally {
      addActivityDialog.value = false
    }
  }

  const addPayment = async () => {
    handlePaymentDialog.value = true;
    paymentStore.setNewGainFromClient(parseInt(route.params.id))
  }

  const savePayment = async function(){
    handlePaymentDialog.value = false; 
    await loadClient()
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