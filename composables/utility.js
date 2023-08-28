
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
    return JSON.parse(JSON.stringify(clientsData, replacerFunc()))
  }

  const getInitials = (name, surname) => {
    const initials = (name.charAt(0) + surname.charAt(0)).toUpperCase();
    return initials;
  }

  const getAge = (dateOfBirth) => {
    console.log({dateOfBirth});
    const ageInSeconds = Math.floor((new Date() / 1000) - dateOfBirth.seconds);
    return Math.floor(ageInSeconds / 31557600);
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('it-IT')
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

  return {
    resolveCircularJsonError,
    getInitials,
    getAge,
    formatDate,
    deepCopy
  }
}