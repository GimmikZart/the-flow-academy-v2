import { defineStore } from 'pinia'

export const usePillNotify = defineStore("pill-notify", () => {
  const message = ref(undefined);
  const type = ref(undefined);
  const timeout = ref(undefined);
  const messagesList = ref([]);

  function resetMessage() {
    message.value = undefined
    type.value = undefined
    timeout.value = undefined
  }

  function newSuccessMessage(value) {
    message.value = value
    type.value = 0
    timeout.value = 5000
    messagesList.value.push({
      message: value,
      type: 0,
    })
  }

  function newErrorMessage(value) {
    message.value = value
    type.value = 1
    timeout.value = 5000
    messagesList.value.push({
      message: value,
      type: 1,
    })
  }

  return {
    message,
    type,
    timeout,
    messagesList,
    resetMessage,
    newSuccessMessage,
    newErrorMessage
  };
});


/* GUIDA AI TIPI*/

// 0 = successo
// 1 = errore
// 2 = warning
// 3 = neutrale