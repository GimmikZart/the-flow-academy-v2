
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

  return {
    resolveCircularJsonError
  }
}