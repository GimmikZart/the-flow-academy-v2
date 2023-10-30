import { defineStore } from 'pinia'
import { ref } from "vue"
import Payment from "@/assets/entities/payment"

export const usePaymentStore = defineStore('payments', () => {
    const payment = ref(new Payment().toPlainObject())

    const setPayment = function(paymentInfos){
        payment.value.id = paymentInfos.id
        payment.value.notes = paymentInfos.notes
        payment.value.amount = paymentInfos.amount
        payment.value.instance_id = paymentInfos.instance_id
        payment.value.date = paymentInfos.date
        payment.value.amount_required = paymentInfos.amount_required
        payment.value.date = paymentInfos.date
        payment.value.paid_in_date = paymentInfos.paid_in_date
        payment.value.status = paymentInfos.status
    }
    const setNewGainFromClient = function(clientId, paymentInfo){
        console.log('SET CLIENT ID', clientId);
        if(paymentInfo) setPayment(paymentInfo)
        payment.value.client_id = clientId
        payment.value.type = 1
        console.log({payment});
    }

    const setNewCostFromClient = function(clientId){
        payment.client_id = clientId
        payment.type = 0
    }

    const setNewGainFromCollaborator = function(collaboratorId){
        payment.collaboratorId = collaboratorId
        payment.type = 1
    }

    const setNewCostFromCollaborator = function(collaboratorId){
        payment.collaboratorId = collaboratorId
        payment.type = 0
    }

    const resetPayment = function(){
        payment.value = new Payment().toPlainObject()
    }

    const getDifferenceOfPaymentEntity = function(paymentInfo) {
        return paymentInfo.amount_required - paymentInfo.amount
    }

    return {
        payment,
        setPayment,
        setNewGainFromClient,
        setNewCostFromClient,
        setNewGainFromCollaborator,
        setNewCostFromCollaborator,
        resetPayment,
        getDifferenceOfPaymentEntity
    }
})