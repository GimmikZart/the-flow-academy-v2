import { supabase } from "@/composables/supabase"
import { usePillNotify } from "@/store/pill";

export class PaymentsApi {
    static async saveEditedPayment(payment_data){
        const pillNotify = usePillNotify();
        try {
            let { error } = await supabase.rpc('upsert_payment', { payment_data })
            if(error) throw error
            pillNotify.newSuccessMessage(`Pagamento andato a buon fine`)
        } catch (error) {
            pillNotify.newErrorMessage(`ERRORE NEL SALVATAGGIO DEL PAGAMENTO: ${error.message}`)
        }
    }
}