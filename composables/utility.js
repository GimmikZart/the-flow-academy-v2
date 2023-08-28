
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
    if(typeof dateOfBirth == 'string'){
      return Math.floor((new Date() - fromStringToDate(dateOfBirth)) / 31557600000);
    } else if (typeof dateOfBirth == 'object') {
      return Math.floor((new Date() - new Date(dateOfBirth)) / 31557600000);
    }
    
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('it-IT')
  }

  function fromStringToDate(dateString) {
    const parts = dateString.split('/');
    if (parts.length !== 3) {
      throw new Error('Formato data non valido');
    }
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Mesi sono indicizzati da 0 a 11
    const year = parseInt(parts[2], 10);
  
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      throw new Error('Formato data non valido');
    }
    return new Date(year, month, day);
  }

  return {
    resolveCircularJsonError,
    getInitials,
    getAge,
    formatDate
  }
}