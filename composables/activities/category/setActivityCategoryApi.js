import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';



export default function() {
  // Ottieni un riferimento alla collezione "clients"
  const clientsCollection = collection(getFirestore(), 'clients');
  // Ottieni un riferimento alla collezione "payments"
  const paymentsCollection = collection(getFirestore(), 'payments');
  // Ottieni un riferimento a un documento di clients
  const getClientReference = async (clientId) => {
    return await doc(getFirestore(), 'clients', clientId);
  }
  
  const addClient =  async (newClient) => {
    if(newClient.dateOfBirth != null) newClient.dateOfBirth = new Date(newClient.dateOfBirth) 
    if(newClient.firstContact != null) newClient.firstContact = new Date(newClient.firstContact)
    const clientOnjPlain = newClient.toPlainObject();
    await addDoc(clientsCollection, clientOnjPlain);
    return newClient;
  }

  const editClient = async (editClient) => {
    console.log({editClient});
    debugger;
    editClient = convertUndefinedToNull(editClient)
    debugger;
    /* if(editClient.dateOfBirth != null) editClient.dateOfBirth = new Date(editClient.dateOfBirth) 
    else editClient.dateOfBirth = null
    if(editClient.firstContact != null) editClient.firstContact = new Date(editClient.firstContact)
    else editClient.firstContact = null */
    const clientRef = await getClientReference(editClient.id);
    await updateDoc(clientRef, editClient);
  };

  const deleteClient = async (removeClient) => {
    const clientRef = await getClientReference(removeClient.id);
    await deleteDoc(clientRef);
  };

  const unsubscribeClient = async (unsubscribeClient) => {
    unsubscribeClient.status = 2
    unsubscribeClient.activities = []
    const clientRef = await getClientReference(unsubscribeClient.id);
    await updateDoc(clientRef, unsubscribeClient);
  };

  const addPayment = async (newPayment) => {
    newPayment.person = await getClientReference(newPayment.person.id);
    const paymentOnjPlain = newPayment.toPlainObject();
    await addDoc(paymentsCollection, paymentOnjPlain);
    console.log({paymentOnjPlain});
    return newPayment;
  }

  return {
    addClient,
    addPayment,
    editClient,
    deleteClient,
    unsubscribeClient
  }
}