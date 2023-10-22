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
                <h6 class="font-bold">{{ props.paymentInfo.date }}</h6>
                <template v-if="props.paymentInfo.paidInDate">
                    <small>In data</small>
                    <h6 class="font-bold">{{ props.paymentInfo.paidInDate }}</h6>
                </template>
            </div>
        </div>
        <div class="rounded-lg p-2 mx-3 cursor-pointer" :class="cardColor" @click="doPayment()">
            <h3 class="font-bold text-xl text-center text-white">70</h3>
            <Icon v-if="isFullPaid" name="mdi:check-bold" size="2rem" color="green"></Icon>
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue"
    /* PROPS */
    const props = defineProps(['paymentInfo'])

    const cardColor = ref("")
    const cardTitle = ref("")
    const paymentValue = ref()
    const isFullPaid = ref(false)

    const setProperties = function(){
        if(props.paymentInfo.amount == 0) {
            cardColor.value = "bg-hard-pink" 
            cardTitle.value = "DA RICEVERE"
            paymentValue.value = props.paymentInfo.amountRequired
        } else if(props.paymentInfo.amount < props.paymentInfo.amountRequired) {
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

    const doPayment = function(){
        
    }

    /* ON CREATE */
    setProperties()

</script>
