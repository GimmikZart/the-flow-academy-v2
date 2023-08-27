<template>
  <div>CIAO TEST</div>
  <InputText  v-model="creds.email"></InputText>
  <InputText :meter="false" v-model="creds.password" type="password"></InputText>
  <Button type="button" label="Login"  @click="userLogin()" />
</template>

<script setup>
const { registerUser, loginUser, user } = useFirebaseAuth() // auto-imported

const router = useRouter();
const creds = reactive({
  email: "",
  password: ""
})

async function handleRegistration() {
  await registerUser(creds.email, creds.password)
}

async function userLogin(){
  await loginUser(creds.email, creds.password)
  .then(() => {
    router.push({ path: "/dashboard" });
  });
}


</script>