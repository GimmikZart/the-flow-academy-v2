export default function() {
    function getDifferenceOfPaymentEntity(payment) {
        return payment.amount_required - payment.amount
    }
    return {
        getDifferenceOfPaymentEntity
    }
}