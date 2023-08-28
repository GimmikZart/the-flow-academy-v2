import { getFirestore, collection, addDoc, doc } from 'firebase/firestore';



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
    const clientOnjPlain = newClient.toPlainObject();
    await addDoc(clientsCollection, clientOnjPlain);
    return newClient;
  }

  const addPayment = async (newPayment) => {
    newPayment.person = await getClientReference(newPayment.person.id);
    const paymentOnjPlain = newPayment.toPlainObject();
    await addDoc(paymentsCollection, paymentOnjPlain);
    console.log({paymentOnjPlain});
    return newPayment;
  }

  return {
    addClient,
    addPayment
  }
}