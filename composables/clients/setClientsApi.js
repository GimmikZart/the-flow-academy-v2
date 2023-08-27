import { getFirestore, collection, addDoc } from 'firebase/firestore';

export default function() {
  // Ottieni un riferimento alla collezione "clients"
  const clientsCollection = collection(getFirestore(), 'clients');
  const paymentsCollection = collection(getFirestore(), 'payments');
  
  const addClient =  async (newClient) => {
    const clientOnjPlain = newClient.toPlainObject();
    await addDoc(clientsCollection, clientOnjPlain);
    return newClient;
  }

  const addPayment = async (newPayment) => {
    newPayment.person = `clients/${newPayment.person.id}`
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