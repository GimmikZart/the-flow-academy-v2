export default class Payment {
  constructor(  
                id = null,
                client_id = null,
                collaborator_id = null,
                instance_id = null,
                type = 1,
                notes = '', 
                amount = 0,
                date = null,
                amount_required = 0,
                paid_in_date = null,
                status = false) {
    this.id = id,
    this.type = type, 
    this.notes = notes 
    this.amount = amount,
    this.amount_required = amount_required,
    this.date = date
    this.paid_in_date = paid_in_date ? paid_in_date : new Date(), 
    this.client_id = client_id,
    this.collaborator_id = collaborator_id,
    this.instance_id = instance_id,
    this.status = status
  }

  // Metodo per convertire un oggetto Client in un oggetto JavaScript standard
  toPlainObject() {
    return {
      id: this.id,
      type: this.type, 
      notes: this.notes, 
      amount: this.amount,
      amount_required: this.amount_required,
      date: this.date,
      paid_in_date:this.paid_in_date, 
      client_id: this.client_id,
      collaborator_id: this.collaborator_id,
      instance_id : this.instance_id,
      status: this.status
    };
  }

  // Metodo per resettare un oggetto Payment 
  reset() {
    this.id = null,
    this.type = null, 
    this.notes = '' 
    this.amount = 0,
    this.amount_required = 0,
    this.date = null,
    this.paid_in_date = new Date(), 
    this.client_id = null,
    this.collaborator_id = null,
    this.instance_id = null,
    this.status = false
  }

  fromClient(clientId){
    this.type = 1
    this.client_id = clientId
  }

  toClient(clientId){
    this.type = 0
    this.client_id = clientId
    return this;
  }

  fromCollaborator(collaboratorId){
    this.type = 1
    this.collaborator_id = collaboratorId
  }

  toCollaborator(collaboratorId){
    this.type = 0
    this.collaborator_id = collaboratorId
  }
}