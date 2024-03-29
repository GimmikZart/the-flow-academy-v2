<template>
  <nuxt-layout name="app-layout">
    <!-- TOP BAR -->
    <section class="w-full h-[50px] bg-white mb-5 rounded-flow p-2 flex items-center justify-between">
      <TopBarLabel label="COLLABORATORI"></TopBarLabel>
      
      <span class="p-input-icon-left h-full w-2/6">
        <Icon name="ic:twotone-search" size="20px"/>
        <InputText v-model="collaboratorFilter['global'].value" placeholder="Filtra collaboratori" class="h-full w-full"/>
      </span>
      
      <div class="flex items-center h-full top-tool-box">
        <TopBarActionModes entity="collaborators" @change-action-mode="(newMode) => actionMode = newMode.value" ></TopBarActionModes>
        <CollaboratorsAddNewCollaborator @saved="loadCollaboratorsList()"></CollaboratorsAddNewCollaborator>
      </div>
    </section>

    <!-- CONTENT -->
    <section class="w-full flex-grow border-4 border-white rounded-flow overflow-hidden">
      <DataTable :filters="collaboratorFilter" filterDisplay="row" :globalFilterFields="['name', 'surname']" resizableColumns columnResizeMode="fit" :value="collaborators" tableStyle="min-width: 50rem" removableSort  stripedRows class="p-datatable-sm" sortMode="multiple">
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
            <Icon v-if="slotProps.data.gender == true" name="icon-park-solid:boy-one" color="blue" size="2rem"></Icon>
            <Icon v-else name="icon-park-solid:girl-one" color="red" size="2rem"></Icon>
          </template>
        </Column>
        <Column field="dateOfBirth" header="Età" sortable>
          <template #body="slotProps">
            {{ getAge(slotProps.data.dateOfBirth) }}
          </template>
          
        </Column>
        <!-- <Column field="activities" header="Attività" sortable >
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
            <StatusLabel :status-value="slotProps.data.status"></StatusLabel>
          </template>
        </Column>
        <Column field="action"  header="Azione">
          <template #body="slotProps">
            <Button v-if="actionMode == 4" text>
              <Icon name="carbon:user-profile" size="2rem" color="brown"></Icon>
            </Button>
            <CollaboratorsEditCollaborator v-else-if="actionMode == 1" :collaboratorId="slotProps.data.id" @saved="loadCollaboratorsList()"></CollaboratorsEditCollaborator>
            <CollaboratorsRemoveCollaborator v-else-if="actionMode == 2" :removingCollaborator="slotProps.data" @saved="loadCollaboratorsList()"></CollaboratorsRemoveCollaborator>
            <CollaboratorsAddNewPayment v-else-if="actionMode == 3 && slotProps.data.status != 2" :editingCollaborator="slotProps.data" @saved="loadCollaboratorsList()"></CollaboratorsAddNewPayment>
          </template>
        </Column>
      </DataTable>
    </section>
  </nuxt-layout>
</template>

<script setup>
  import { ref, onBeforeMount  } from 'vue';
  import { FilterMatchMode } from 'primevue/api';
  const supabase = useSupabaseClient()
  const { getInitials, getAge } = utility()

  const collaborators = ref();
  const actionMode = ref(4);
  const collaboratorFilter= ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    surname: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
  })

  const loadCollaboratorsList = async () => {
    try {
      let { data, error} = await supabase.from('collaborators').select('*')
      if(error) throw error
      collaborators.value = data
    } catch (error) {
      newErrorMessage(`ERRORE NELL'AQUISIZIONE DEI COLLABORATORI DAL DB: ${error.message}`)
    }
  }

/* HOOKS */ 
  onBeforeMount(async () => {
    loadCollaboratorsList()
  })    
</script>
