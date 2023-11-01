import { supabase } from "@/composables/supabase"
import { usePillNotify } from "@/store/pill";

export class ClientApi {
    static async getActivitiesList(userId){
        const pillNotify = usePillNotify();
        try {
            const { data, error } = await supabase.from("client_instance").select("instances(id, name, level, cost)").eq("client_id", userId)
            if (error) throw error
            console.log({data});
            return data
        } catch (error) {
            console.log({error});
            pillNotify.newErrorMessage(`ERRORE NELL'AQUISIZIONE DELLE ATTIVITA' LEGATE AL CLIENTE: ${error.message}`)
        }
    }

    static async getSuggestedPayments(client_id_param){
        const pillNotify = usePillNotify();
        try {
            let { data, error } = await supabase.rpc('get_incomplete_payments', { client_id_param })
            if(error) throw error
            return data
        } catch (error) {
            pillNotify.newErrorMessage(`ERRORE NELL'AQUISIZIONE DEI PAGAMENTI SUGGERITI DAL DB: ${error.message}`)
        }
    }
}