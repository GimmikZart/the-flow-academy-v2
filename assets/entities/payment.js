export default class Payment {
  constructor(  
                id = null,
                client_id = null,
                collaborator_id = null,
                type = 1,
                notes = '', 
                amount = 0,
                paid_in_date = new Date(),
                status = false) {
    this.id = id,
    this.type = type, 
    this.notes = notes 
    this.amount = amount,
    this.paid_in_date = paid_in_date, 
    this.client_id = client_id,
    this.collaborator_id = collaborator_id,
    this.status = status
  }

  // Metodo per convertire un oggetto Client in un oggetto JavaScript standard
  toPlainObject() {
    return {
      id: this.id,
      type: this.type, 
      notes: this.notes, 
      amount: this.amount,
      paid_in_date:this.paid_in_date, 
      client_id: this.client_id,
      collaborator_id: this.collaborator_id,
      status: this.status
    };
  }

  // Metodo per resettare un oggetto Payment 
  reset() {
    this.id = null,
    this.type = null, 
    this.notes = '' 
    this.amount = 0,
    this.paid_in_date = new Date(), 
    this.client_id = null,
    this.collaborator_id = null,
    this.status = false
  }

  fromClient(clientId){
    this.type = 1
    this.client_id = clientId
  }

  toClient(clientId){
    console.log('EH BHE?');
    this.type = 0
    this.client_id = clientId
    console.log(this);
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