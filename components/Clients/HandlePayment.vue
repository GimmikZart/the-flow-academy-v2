<template>
    <Dialog
        :visible="visible"
        modal
        :header="`Modifica il pagamento di ${client.name} ${client.surname}:`"
        :style="{ width: '30vw' }"
    >
        <div class="grid grid-rows-3 grid-cols-2 gap-10 p-10">
            <span class="p-float-label col-start-1 col-end-3">
                <InputText v-model="instanceInfo" disabled class="w-full"/>
                <label>Per la seguente attività</label>
            </span>

            <span class="p-float-label col-start-1 col-end-2">
                <InputNumber
                    v-model="editPayment.amount"
                    mode="currency"
                    currency="EUR"
                    locale="it-IT"
                    placeholder="Un ammontare di"
                    :minFractionDigits="2"
                    dateFormat="dd/mm/yy"
                    class="w-full"
                />
                <label>Un ammontare di</label>
            </span>

            <span class="p-float-label col-start-2 col-end-3">
                <Calendar
                    v-model="editPayment.paid_in_date"
                    placeholder="Data Pagamento"
                    dateFormat="dd/mm/yy"
                    class="w-full"
                />
                <label>In data</label>
            </span>

            <span class="p-float-label col-start-1 col-end-2">
                <InputNumber
                    v-model="editPayment.amount_required"
                    mode="currency"
                    currency="EUR"
                    locale="it-IT"
                    placeholder="Un ammontare di"
                    :minFractionDigits="2"
                    dateFormat="dd/mm/yy"
                    class="w-full"
                />
                <label>Su un totale dovuto di</label>
            </span>

            <span class="col-start-2 col-end-3">
                <ToggleButton v-model="editPayment.status" onLabel="Concluso" offLabel="Non concluso"  class="w-full"/>
                
            </span>

            <span class="p-float-label col-start-1 col-end-3">
                <InputText v-model="editPayment.notes" class="w-full"></InputText>
                <label>Note aggiuntive</label>
            </span>
        </div>
        <template #footer>
            <Button label="Chiudi" @click="emits('close')" outlined />
            <Button
                label="Salva"
                severity="success"
                @click="saveEditedPayment()"
                outlined
            />
        </template>
    </Dialog>
</template>
<script setup>
import { watch } from "vue"
const { reloadApp } = utility()

/* SUPABASE */
const supabase = useSupabaseClient()

/* PROPS */
const props = defineProps({
    visible: {
        type: Boolean,
        required: false,
        default: false
    },
    client: {
        type: Object,
        required: true
    },
    editPayment: {
        type: Object,
        required: true
    }
})

/* EMITS */
const emits = defineEmits(["close"])

/* COMPUTED */
const instanceInfo = computed(() => {
    if(props.editPayment.instances){
        return `${ props.editPayment.instances.name} - ${props.editPayment.instances.level}`
    } else {
        return "ALTRO"
    }
})

watch(() => props.editPayment.amount, (newValue) => {
    if(newValue < props.editPayment.amount_required) props.editPayment.status = false
    else props.editPayment.status = true
})

watch(() => props.editPayment.status, (newStatus) => {
    if(newStatus) props.editPayment.amount_required = props.editPayment.amount
})

const saveEditedPayment = async function(){
    try {
        let preparedPayment = {...props.editPayment};
        delete preparedPayment.instances
        const { error } = await supabase.from("payments").update(preparedPayment).eq("id", preparedPayment.id);
        if (error) throw error
        reloadApp()
    } catch (error) {
        console.log({error});
    }
}
</script>
