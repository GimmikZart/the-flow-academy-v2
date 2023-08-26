import { defineStore } from 'pinia'

export const useFiltersStore = defineStore({
  id: 'pill-notify',
  state: () => {
    return {
      message: undefined,
      type: undefined,
      timeout: undefined,
      messagesList: []
    }
  },
  actions: {
    resetMessage(){
      this.message = undefined
      this.type = undefined
      this.timeout = undefined
    },
    newSuccessMessage(value) {
      this.message = value
      this.type = 0
      this.timeout = 5000
      this.messagesList.push({
        message: value,
        type: 0,
      })
    },
    newErrorMessage(value) {
      this.message = value
      this.type = 1
      this.timeout = 5000
      this.messagesList.push({
        message: value,
        type: 1,
      })
    },
  },
  getters: {
    getMessage: state => state.message,
    getType: state => state.type,
    getTimeout: state => state.timeout,
  },
})

/* GUIDA AI TIPI*/

// 0 = successo
// 1 = errore
// 2 = warning
// 3 = neutrale