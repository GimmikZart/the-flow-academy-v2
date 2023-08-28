export default class ActivityInstance {
  constructor(  
                name = '', 
                level = '', 
                collaborators = [],
                clients = [], 
                activities = []) {
    this.name = name, 
    this.level = level, 
    this.collaborators = collaborators,
    this.clients = clients, 
    this.activities = activities
  }

  // Metodo per convertire un oggetto Client in un oggetto JavaScript standard
  toPlainObject() {
    return {
      name: this.name, 
      level: this.level , 
      collaborators: this.collaborators,
      clients: this.clients, 
      activities: this.activities
    };
  }

  // Metodo per resettare un oggetto Payment 
  reset() {
    this.name = '', 
    this.level = '', 
    this.collaborators = [],
    this.clients = [], 
    this.activities = []
  }
}