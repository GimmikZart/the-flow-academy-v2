
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
    return Math.floor((new Date() - new Date(formatDate(dateOfBirth))) / 31557600000);
  }

  const formatDate = (date) => {
    return new Date(date.seconds * 1000).toLocaleDateString('it-IT')
  }

  return {
    resolveCircularJsonError,
    getInitials,
    getAge,
    formatDate
  }
}