import { supabase } from "@/composables/supabase"
import { usePillNotify } from "@/store/pill";

export class CollaboratorApi {
    static async getActivitiesList(userId){
        const pillNotify = usePillNotify();
        try {
            const { data, error } = await supabase.from("collaborator_instance").select("instances(id, name, level, cost)").eq("collaborator_id", userId)
            if (error) throw error
            return data
        } catch (error) {
            pillNotify.newErrorMessage(`ERRORE NELL'AQUISIZIONE DELLE ATTIVITA' LEGATE AL COLLABORATORE: ${error.message}`)
        }
    }
}