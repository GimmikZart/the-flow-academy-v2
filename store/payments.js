import { defineStore } from 'pinia'
import { ref } from "vue"
import Payment from "@/assets/entities/payment"
import { useFiltersStore } from "@/store/pill";
/* SUPABASE */
const supabase = useSupabaseClient()

export const useFiltersStore = defineStore('payments', () => {
    const payment = ref(new Payment())

    const setPayment = function(paymentInfos){
        payment.value.id = paymentInfos.id
        payment.value.notes = paymentInfos.notes
        payment.value.amount = paymentInfos.amount
        payment.value.client_id = paymentInfos.client_id
        payment.value.collaborator_id = paymentInfos.collaborator_id
        payment.value.instance_id = paymentInfos.instance_id
        payment.value.amount_required = paymentInfos.amount_required
        payment.value.paid_in_date = paymentInfos.paid_in_date
        payment.value.status = paymentInfos.status
    }
    const setNewGainFromClient = function(paymentInfos, clientId){
        setPayment(paymentInfos)
        payment.value.fromClient(clientId)
    }

    const setNewCostFromClient = function(paymentInfos, clientId){
        setPayment(paymentInfos)
        payment.value.toClient(clientId)
    }

    const setNewGainFromCollaborator = function(paymentInfos, collaboratorId){
        setPayment(paymentInfos)
        payment.value.fromCollaborator(collaboratorId)
    }

    const setNewCostFromCollaborator = function(paymentInfos, collaboratorId){
        setPayment(paymentInfos)
        payment.value.toCollaborator(collaboratorId)
    }

    const savePayment = async function(){
        let payment_data = payment.value
        return await supabase.rpc('upsert_payment', { payment_data })
    }

    const resetPayment = function(){
        payment.value = new Payment()
    }

    return {
        payment,
        setPayment,
        setNewGainFromClient,
        setNewCostFromClient,
        setNewGainFromCollaborator,
        setNewCostFromCollaborator,
        savePayment,
        resetPayment
    }
})