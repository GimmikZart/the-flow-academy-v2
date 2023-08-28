import { getFirestore, doc, collection, query, where, getDocs, getDoc } from 'firebase/firestore'

export default function() {
  // Ottieni un riferimento alla collezione "clients"
  const activityInstanceCollection = collection(getFirestore(), 'activityInstances');

  const getActivityInstanceList =  async () => {
    console.log('YAAAAHOOOOOOO');
    const querySnapshot = await getDocs(activityInstanceCollection);
    const activityInstanceData = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const instance =  doc.data();

      instance.id = doc.id

      /* ACTIVITY REFERENCES */
      const activities = await Promise.all(instance.activities.map(async (activity) => {
        const activityDocument = await getOneDoc(activity.id, 'activities');
        return activityDocument.name;
      }));
      instance.activities = activities;
      
      /* CLIENTS REFERENCES */
      const clients = await Promise.all(instance.clients.map(async (client) => {
        const clientDocument = await getOneDoc(client.id, 'clients');
        return clientDocument;
      }));
      instance.clients = clients.length;

      /* COLLABORATORS REFERENCES */
      const collaborators = await Promise.all(instance.collaborators.map(async (collaborator) => {
        const collaboratorDocument = await getOneDoc(collaborator.id, 'collaborators');
        return collaboratorDocument;
      }));
      instance.collaborators = collaborators.length;
      
      return instance;
    }));
    return activityInstanceData;
  }

  async function getOneActivityInstance(id){
    const docRef = doc(getFirestore(), 'activityInstances', id);
    const docSnap = await getDoc(docRef);
    return docSnap.data()
  }

  async function getOneDoc(id, collection){
    const docRef = doc(getFirestore(), collection, id);
    const docSnap = await getDoc(docRef);
    return docSnap.data()
  }

  return {
    getActivityInstanceList,
    getOneActivityInstance
  }
}