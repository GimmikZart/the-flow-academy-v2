<template>
  <div>CIAO TEST</div>
  <InputText  v-model="creds.email"></InputText>
  <InputText :meter="false" v-model="creds.password" type="password"></InputText>
  <Button type="button" label="Login"  @click="handleLogin()" />
</template>

<script setup>
const supabase = useSupabaseClient()
/* const filtersStore = useFiltersStore()
const { newErrorMessage } = filtersStore */



const router = useRouter();
const creds = reactive({
  email: "",
  password: ""
})


async function handleLogin(){
  try {
    const { error } = await supabase.auth.signInWithPassword({ 
      email: creds.email,
      password: creds.password
    }).then(() => {
      router.push({ path: "/dashboard" });
    })

    ;
  } catch (error) {
    console.log(error);
  }
}


</script>