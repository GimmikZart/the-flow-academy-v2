export default class Payment {
  constructor(  
                type = null, 
                person = null, 
                notes = '', 
                amount = 0,
                date = new Date(), 
                activities = []) {
    this.date = date,
    this.person = person;
    this.type = type;
    this.notes = notes, 
    this.amount = amount,
    this.activities = activities
  }

  // Metodo per convertire un oggetto Client in un oggetto JavaScript standard
  toPlainObject() {
    return {
      date: this.date,
      person: this.person,
      type: this.type,
      amount : this.amount,
      notes: this.notes,
      activities: this.activities,
    };
  }

  // Metodo per resettare un oggetto Payment 
  reset() {
    this.date = new Date(),
    this.person = null,
    this.type = null,
    this.amount = 0,
    this.notes = '',
    this.activities = []
  }
}