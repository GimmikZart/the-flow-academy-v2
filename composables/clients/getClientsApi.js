import { getFirestore, doc, collection, query, where, getDocs, getDoc } from 'firebase/firestore'

export default function() {

  const getClients =  async () => {
    console.log('YAAAAHOOOOOOO');
    const querySnapshot = await getDocs(collection(getFirestore(), "clients"));
    const clientsData = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const client = doc.data();

      /* ACTIVITY REFERENCES */
      const activities = await Promise.all(client.activities.map(async (activity) => {
        const activityDocument = await getOneDoc(activity.id, 'activities');
        return activityDocument;
      }));
      client.activities = activities;

      /* PAYMENTS REFERENCES */
      const payments = await Promise.all(client.payments.map(async (payment) => {

        const paymentDocument = await getOneDoc(payment.id, 'payments');

        //activities in payment
        const activities = await Promise.all(paymentDocument.activities.map(async (activity) => {
          const activityDocument = await getOneDoc(activity.id, 'activities');
          return activityDocument;
        }));
        //person in payment
        const person = await getOneDoc(paymentDocument.person.id, 'clients');
        const personToInject = {
          name: person.name,
          surname: person.surname
        }
        paymentDocument.activities = activities
        paymentDocument.person = personToInject

        return paymentDocument;
      }));
      
      client.payments = payments;

      return client;
    }));
    return clientsData;
  }

  async function getOneDoc(id, collection){
    const docRef = doc(getFirestore(), collection, id);
    const docSnap = await getDoc(docRef);
    return docSnap.data()
  }

  return {
    getClients
  }
}