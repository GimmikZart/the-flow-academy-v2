export default class Activity {
  constructor( name = '',
                category = '',
                collaborators = [],
                color = '',
                description = '',
                image = '',
                instances = [],
                intern = true
                ) {
    this.name = name
    this.category = category,
    this.collaborators = collaborators,
    this.color = color,
    this.description = description,
    this.image = image,
    this.instances = instances,
    this.intern = intern
  }

  // Metodo per convertire un oggetto Client in un oggetto JavaScript standard
  toPlainObject() {
    return {
      name: this.name,
      category: this.category,
      collaborators: this.collaborators,
      color: this.color,
      description: this.description,
      image: this.image,
      instances: this.instances,
      intern: this.intern
    };
  }

  // Metodo per resettare un oggetto Payment 
  reset() {
    this.name = '',
    this.category = '',
    this.collaborators = [],
    this.color = '',
    this.description = '',
    this.image = '',
    this.instances = [],
    this.intern = true
  }
}