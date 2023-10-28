export default class ClientInstance {
  constructor( 
              client_id = null,
              instance_id = null,
              status = true
            ) {
    this.client_id = client_id
    this.instance_id = instance_id
    this.status = true
  }

  // Metodo per convertire un oggetto in un oggetto JavaScript standard
  toPlainObject() {
    return {
      client_id: this.client_id,
      instance_id: this.instance_id,
      status: this.status
    };
  }

  reset() {
    this.client_id = null
    this.instance_id = null
    this.status = true
  }
}