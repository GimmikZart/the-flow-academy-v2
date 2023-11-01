<template>
    <!-- BOX -->
    <div class="relative">
        <div class="h-full w-[250px] rounded-lg overflow-hidden bg-white flex flex-col smooth-fast" :class="getComputedClass">
            <div class="w-full h-full bg-gray">
                <!-- immagine -->
            </div>
            <div class="p-3 font-bold flex flex-wrap items-center justify-between text-base w-full h-min">
                <h3>{{activityInfo.instances.name}}</h3>
                <Chip>{{activityInfo.instances.level}}</Chip>
            </div>
            
        </div>
        <Button v-if="editMode" rounded :severity="getSuspendSeverity" class="absolute bottom-3 absolute-center-y bg-white" @click="handleSuspendActivity()">
            <template #icon>
                <Icon v-if="activityInfo.status" name="mdi:hourglass" color="white" size="30"></Icon>
                <Icon v-else name="icon-park-solid:back" color="white" size="30"></Icon>
            </template>
        </Button>
        <Button v-else-if="removeMode" rounded severity="danger" class="absolute bottom-3 absolute-center-y bg-white" @click="removeActivity()">
            <template #icon>
                <Icon name="material-symbols:delete" color="white" size="30"></Icon>
            </template>
        </Button>
    </div>
</template>
<script setup>
import { computed } from "vue"
import { usePillNotify } from "@/store/pill";

const pillNotify = usePillNotify()
const { newSuccessMessage, newErrorMessage } = pillNotify

const supabase = useSupabaseClient()
/* PROPS */
const props = defineProps({
    activityInfo: {
        type: Object,
        required: true
    },
    editMode: {
        type: Boolean,
        required: false,
        default: false
    },
    removeMode: {
        type: Boolean,
        required: false,
        default: false
    }
})

/* EMITS */
const emits = defineEmits(["handled"])

/* COMPUTED */
const getComputedClass = computed(() => {
    let classes = ""
    if(props.editMode) classes += "flickering border-2 border-warning"
    if(props.removeMode) classes += "flickering border-2 border-danger"
    if(props.activityInfo.status == false) classes += " opacity-50"
    return classes
})

const getSuspendSeverity = computed(() => {
    if(props.activityInfo.status == true){
        return "warning"
    } else {
        return "success"
    }
})

const handleSuspendActivity = async function(){
    let newStatus = !props.activityInfo.status
    let successMessage = newStatus ? "L'attività è stata correttamente ripristinata" : "L'attività è stata correttamente sospesa"
    let errorMessage = newStatus ? "Errore nel ripristino dell'attività" : "Errore nella sospensione dell'attività"
    try {
        const { error } =await supabase.from('client_instance')
                                        .update({ status: newStatus })
                                        .eq('id', props.activityInfo.id)
        if(error) throw error
        newSuccessMessage(successMessage)
        emits("handled")
    } catch (error) {
        newErrorMessage(`${errorMessage}: ${error}`)
    }
}

const removeActivity = async function(){
    try {
        await supabase.from('client_instance')
                    .delete()
                    .eq('id', props.activityInfo.id)
        newSuccessMessage(`Attività rimossa correttamente`)
        emits("handled")
    } catch (error) {
        newErrorMessage(`Errore nella rimozione dell'attività: ${error}`)
    }
    
}
</script>
<style>
</style>
