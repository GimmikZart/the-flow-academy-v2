import { defineStore } from 'pinia'
import { ref } from "vue"
import Payment from "@/assets/entities/payment"

export const usePaymentStore = defineStore('payments', () => {
    const payment = ref(new Payment().toPlainObject())
    const paymentTypes = ref([
        {
            value: 0,
            label: "Entrata"
        },
        {
            value: 1,
            label: "Uscita"
        }
    ])

    const setPayment = function(paymentInfos){
        payment.value.id = paymentInfos.id
        payment.value.notes = paymentInfos.notes
        payment.value.amount = paymentInfos.amount
        payment.value.type = paymentInfos.type
        payment.value.instance_id = paymentInfos.instance_id
        payment.value.date = paymentInfos.date
        payment.value.amount_required = paymentInfos.amount_required
        payment.value.date = paymentInfos.date
        payment.value.paid_in_date = paymentInfos.paid_in_date ? paymentInfos.paid_in_date : new Date()
        payment.value.status = paymentInfos.status
    }
    const setNewGainFromClient = function(clientId, paymentInfo){
        resetPayment()
        if(paymentInfo) setPayment(paymentInfo)
        payment.value.client_id = clientId
        payment.value.type = 1
    }

    const setNewCostFromClient = function(clientId, paymentInfo){
        resetPayment()
        if(paymentInfo) setPayment(paymentInfo)
        payment.client_id = clientId
        payment.type = 0
    }

    const setNewGainFromCollaborator = function(collaboratorId, paymentInfo){
        resetPayment()
        if(paymentInfo) setPayment(paymentInfo)
        payment.collaboratorId = collaboratorId
        payment.type = 1
    }

    const setNewCostFromCollaborator = function(collaboratorId,paymentInfo){
        resetPayment()
        if(paymentInfo) setPayment(paymentInfo)
        payment.collaboratorId = collaboratorId
        payment.type = 0
    }

    const resetPayment = function(){
        payment.value = new Payment().toPlainObject()
    }

    const getDifferenceOfPaymentEntity = function(paymentInfo) {
        return paymentInfo.amount_required - paymentInfo.amount
    }

    const clientInstaPay = function(clientId, paymentInfo){
        setNewGainFromClient(clientId, paymentInfo)
        payment.value.amount = paymentInfo.amount_required
        payment.value.date = new Date()
    }

    return {
        payment,
        paymentTypes,
        setPayment,
        setNewGainFromClient,
        setNewCostFromClient,
        setNewGainFromCollaborator,
        setNewCostFromCollaborator,
        resetPayment,
        getDifferenceOfPaymentEntity,
        clientInstaPay
    }
})