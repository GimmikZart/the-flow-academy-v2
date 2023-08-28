export default class Client {
  constructor(  avatar = '', 
                name = '', 
                surname = '', 
                gender = true, 
                email = '', 
                telephone = '', 
                dateOfBirth = '', 
                address = '', 
                sizes = { head: '', pants: '', shirt: '', shoes: ''},
                notes = '',
                firstContact = new Date().toLocaleDateString('it-IT'),
                status = 0,
                activities = [], 
                payments = [],
                description = '',
                color = '',
                linkSocial = { fb: '', ig: '', ln: '', tk: '', web: ''}) {
    this.avatar = avatar,
    this.name = name;
    this.surname = surname;
    this.gender = gender, 
    this.email = email, 
    this.telephone = telephone, 
    this.dateOfBirth = dateOfBirth, 
    this.address = address, 
    this.firstContact = firstContact, 
    this.activities = activities, 
    this.payments = payments, 
    this.sizes = sizes, 
    this.status = status, 
    this.notes = notes,
    this.description = description,
    this.color = color,
    this.linkSocial = linkSocial
  }

  // Metodo per convertire un oggetto Client in un oggetto JavaScript standard
  toPlainObject() {
    return {
      avatar: this.avatar,
      name: this.name,
      surname: this.surname,
      gender: this.gender,
      email: this.email,
      telephone: this.telephone,
      dateOfBirth: this.dateOfBirth,
      address: this.address,
      firstContact: this.firstContact,
      activities: this.activities,
      payments: this.payments,
      sizes: this.sizes,
      status: this.status,
      notes: this.notes,
      description: this.description, 
      color: this.color,    
      linkSocial: this.linkSocial 
    };
  }

  // Metodo per resettare un oggetto Client
  reset() {
    this.avatar = "",
    this.name = "",
    this.surname = "",
    this.gender = true,
    this.email = "",
    this.telephone = "",
    this.dateOfBirth = "",
    this.address = "",
    this.firstContact = new Date().toLocaleDateString('it-IT'),
    this.activities = "",
    this.payments = "",
    this.sizes = { head: '', pants: '', shirt: '', shoes: ''},
    this.status = "",
    this.notes = "",
    this.description = "", 
    this.color = "",    
    this.linkSocial = { fb: '', ig: '', ln: '', tk: '', web: ''}
  }
}