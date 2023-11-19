export default class CollaboratorRole {
  constructor( name = '') {
    this.name = name
  }

  // Metodo per convertire un oggetto Client in un oggetto JavaScript standard
  toPlainObject() {
    return {
      name: this.name
    };
  }

  // Metodo per resettare un oggetto Payment 
  reset() {
    this.name = ''
  }
}