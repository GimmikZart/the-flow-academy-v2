<template>
    <!-- BOX -->
    <div class="h-full w-[250px] rounded-lg overflow-hidden bg-white flex flex-col pb-3">
        <div class="w-full p-3" :class="cardColor">
            <h3 class="font-bold text-base text-center text-white">{{cardTitle}}</h3>
        </div>
        <div class="h-full overflow-hidden p-3">
            <div class="h-full overflow-auto ">
                <small>Per l'attività</small>
                <h6 class="font-bold">{{ props.paymentInfo.instances.name }}</h6>
                <small>Per il mese di</small>
                <h6 class="font-bold">{{ formatDateMonthYear(props.paymentInfo.date) }}</h6>
                <template v-if="props.paymentInfo.amount > 0 && getDifferenceOfPaymentEntity(props.paymentInfo) > 0">
                    <small>Ricevuti</small>
                    <h6 class="font-bold">{{ props.paymentInfo.amount }}</h6>
                </template>
                <template v-if="props.paymentInfo.paid_in_date">
                    <small>In data</small>
                    <h6 class="font-bold">{{ formatDate(props.paymentInfo.paid_in_date) }}</h6>
                </template>
            </div>
        </div>
        <div class="mx-3">
            <ClientsAddNewPayment v-if="!isFullPaid" :editingClient="clientInfo" :directPayment="paymentInfo" @saved="reloadApp()"></ClientsAddNewPayment>
            <div v-else class="rounded-lg flex items-center justify-center p-2" :class="cardColor">
                <span class="w-1/3"></span>
                <h3 class="w-1/3 font-bold text-xl text-center text-white">{{paymentInfo.amount}}</h3>
                <Icon name="mdi:check-bold" size="2rem" color="green" class="w-1/3"></Icon>
            </div>
        </div>
        
    </div>
</template>
<script setup>
import { ref } from "vue"
import { useDateFormat } from '@vueuse/core'
const { reloadApp, formatDateMonthYear,formatDate } = utility()
const { getDifferenceOfPaymentEntity } = paymentsUtils()
    /* PROPS */
    const props = defineProps({
        paymentInfo: {
            type: Object,
            required: true
        },
        clientInfo: {
            type: Object,
            required: true
        }
    })


    const cardColor = ref("")
    const cardTitle = ref("")
    const paymentValue = ref()
    const isFullPaid = ref(false)

    const setProperties = function(){
        if(props.paymentInfo.amount == 0) {
            cardColor.value = "bg-hard-pink" 
            cardTitle.value = "DA RICEVERE"
            paymentValue.value = props.paymentInfo.amountRequired
        } else if(props.paymentInfo.amount < props.paymentInfo.amount_required) {
            cardColor.value = "bg-orange"
            cardTitle.value = "RICEVUTO PARZIALE" 
            paymentValue.value = props.paymentInfo.amountRequired - props.paymentInfo.amount
        } else {
            cardColor.value = "bg-green"
            cardTitle.value = "RICEVUTO"
            paymentValue.value = props.paymentInfo.amountRequired
            isFullPaid.value = true
        }
    }

    /* ON CREATE */
    setProperties()

</script>
