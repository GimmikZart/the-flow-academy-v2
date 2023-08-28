import { getFirestore, doc, collection, query, where, getDocs, getDoc } from 'firebase/firestore'

export default function() {

  const getCollaborators =  async () => {
    console.log('YAAAAHOOOOOOO collaborators');
    const querySnapshot = await getDocs(collection(getFirestore(), "collaborators"));
    
    const collaboratorsData = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const collaborator = doc.data();

      collaborator.id = doc.id
      
      /* ACTIVITY REFERENCES */
      const activities = await Promise.all(collaborator.activities.map(async (activity) => {
        const activityDocument = await getOneDoc(activity.id, 'activities');
        return activityDocument;
      }));
      collaborator.activities = activities;

      /* PAYMENTS REFERENCES */
      const payments = await Promise.all(collaborator.payments.map(async (payment) => {

        const paymentDocument = await getOneDoc(payment.id, 'payments');

        //activities in payment
        const activities = await Promise.all(paymentDocument.activities.map(async (activity) => {
          const activityDocument = await getOneDoc(activity.id, 'activities');
          return activityDocument;
        }));
        //person in payment
        const person = await getOneDoc(paymentDocument.person.id, 'collaborators');
        const personToInject = {
          name: person.name,
          surname: person.surname
        }
        paymentDocument.activities = activities
        paymentDocument.person = personToInject

        return paymentDocument;
      }));
      
      collaborator.payments = payments;

      return collaborator;
    }));
    return collaboratorsData;
  }

  async function getOneDoc(id, collection){
    const docRef = doc(getFirestore(), collection, id);
    const docSnap = await getDoc(docRef);
    return docSnap.data()
  }

  return {
    getCollaborators
  }
}