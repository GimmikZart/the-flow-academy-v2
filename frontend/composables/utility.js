
import { useDateFormat } from '@vueuse/core'
export default function() {

  const replacerFunc = () => {
    const visited = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (visited.has(value)) {
          return;
        }
        visited.add(value);
      }
      return value;
    };
  };

  const resolveCircularJsonError = (circObj) => {
    return JSON.parse(JSON.stringify(circObj, replacerFunc()))
  }

  const getInitials = (name, surname) => {
    const initials = (name.charAt(0) + surname.charAt(0)).toUpperCase();
    return initials;
  }

  const getAge = (dateOfBirth) => {
    if(dateOfBirth){
      const ageInSeconds = Math.floor((new Date() / 1000) - new Date(dateOfBirth) / 1000);
      return Math.floor(ageInSeconds / 31557600);
    } else {
      return "---"
    }
  }

  function isMonthPaid(lastPaymentDate) {
    let today = new Date();
    let lastPaymentDateObj = new Date(lastPaymentDate.seconds * 1000)
    return today.getFullYear() === lastPaymentDateObj.getFullYear() && today.getMonth() === lastPaymentDateObj.getMonth();
  }

  const formatDate = (date) => {
    //return new Date(date).toLocaleDateString('it-IT')
    return useDateFormat(date, 'DD/MM/YYYY').value
  }

  const formatDateMonthYear = (date) => {
    return useDateFormat(date, 'MMMM YYYY').value.toUpperCase()
  }

  function deepCopy(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
  
    if (obj instanceof Date) {
      return new Date(obj);
    }
  
    if (obj instanceof Array) {
      const copyArr = [];
      for (let i = 0; i < obj.length; i++) {
        copyArr[i] = deepCopy(obj[i]);
      }
      return copyArr;
    }
  
    if (obj instanceof Object) {
      const copyObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          copyObj[key] = deepCopy(obj[key]);
        }
      }
      return copyObj;
    }
  }

  function convertUndefinedToNull(obj) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (obj[prop] === undefined) {
          obj[prop] = null;
        }
      }
    }
    return obj;
  }

  function reloadApp(){
    window.location.reload()
  }

  return {
    resolveCircularJsonError,
    getInitials,
    getAge,
    formatDate,
    deepCopy,
    isMonthPaid,
    convertUndefinedToNull,
    reloadApp,
    formatDateMonthYear
  }
}