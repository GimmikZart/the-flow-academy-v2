<template>
  <section id="pill" class="w-full h-[50px] mt-5 flex justify-center z-top">
    <div>
      <div class="h-full flex grow overflow-hidden">
        <div class="w-[175px] h-full rounded-l-[30px] bg-white flex items-center pl-3 border-r-2">
          <Icon name="ph:calendar" color="black" size="2rem"/>
          <span class="text-l font-bold ml-6">{{new Date().toLocaleDateString('it-IT')}}</span>
        </div>
        <div id="system-message-box" ref="messageBox" class="h-full flex items-center justify-center" :class="messageBoxClass">
          {{ getMessage }}
        </div>
        <div class="w-[175px] h-full rounded-r-[30px] bg-white flex items-center justify-end pr-3 border-l-2">
          <span class="text-xl font-bold mr-6">{{ clock }}</span>
          <Icon name="bi:clock" color="black" size="2rem"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useFiltersStore } from '~/store/pill'
import { storeToRefs } from 'pinia'

/* LOCAL DATA */
  let clock = ref(new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }));

/* STORE DATA */
  const filtersStore = useFiltersStore()
  const { resetMessage } = filtersStore
  const { getMessage,  getType, getTimeout} = storeToRefs(filtersStore)

/* COMPUTED */
  const messageBoxClass = computed(() => {
    let className;
    switch (getType.value) {
      case 0:
        className = 'success'
        break;
      case 1:
        className = 'error'
        break;
      case 2:
        className = 'warning'
        break;
      case 3:
        className = 'neutral'
        break;
      default:
        className = ''
        break;
    }
    setTimeout(() => {
      resetMessage()
    }, getTimeout.value);
    return className
  })

/* HOOKS */ 
  onMounted(() => {
    setInterval(() => {
      clock.value = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    }, 1000);
  })
</script>

<style lang="scss" scoped>
#system-message-box{
  width: 0px;
  transition: all 0.3s;
  overflow: hidden;
}


#system-message-box.error{
  width: 600px;
  padding: 0.5rem;
  background-color: red;
  color: white;
}
#system-message-box.success{
  width: 600px;
  padding: 0.5rem;
  background-color: green;
  color: white;
}
#system-message-box.warning{
  width: 600px;
  padding: 0.5rem;
  background-color: yellow;
  color: black;
}
#system-message-box.neutral{
  width: 600px;
  padding: 0.5rem;
  background-color: blue;
  color: white;
}
</style>
