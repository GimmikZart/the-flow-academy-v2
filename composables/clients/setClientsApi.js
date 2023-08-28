import { getFirestore, collection, addDoc, doc, updateDoc } from 'firebase/firestore';



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
    newClient.dateOfBirth = new Date(newClient.dateOfBirth)
    newClient.firstContact = new Date(newClient.firstContact)
    const clientOnjPlain = newClient.toPlainObject();
    await addDoc(clientsCollection, clientOnjPlain);
    return newClient;
  }

  const editClient = async (editClient) => {
    editClient.dateOfBirth = new Date(editClient.dateOfBirth)
    editClient.firstContact = new Date(editClient.firstContact)
    const clientRef = await getClientReference(editClient.id);
    await updateDoc(clientRef, editClient);
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
    editClient
  }
}