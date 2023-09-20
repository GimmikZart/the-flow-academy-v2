export default class Payment {
  constructor(  
                type = null, 
                person = null, 
                notes = '', 
                amount = 0,
                date = new Date(), 
                activities = [],
                paid_in_date = null,
                status = false,
                amount_required = null) {
    this.date = date,
    this.person = person;
    this.type = type;
    this.notes = notes, 
    this.amount = amount,
    this.activities = activities
    this.paid_in_date = paid_in_date
    this.amount_required = amount_required
    this.status = status
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
      amount_required: this.amount_required,
      paid_in_date: this.paid_in_date,
      status: this.status
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
    this.amount_required = null,
    this.paid_in_date = null,
    this.status = false
  }
}