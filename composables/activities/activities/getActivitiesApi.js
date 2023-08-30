import { getFirestore, doc, collection, query, where, getDocs, getDoc } from 'firebase/firestore'

export default function() {

  const getActivities =  async () => {
    console.log('YAAAAHOOOOOOO');
    const querySnapshot = await getDocs(collection(getFirestore(), "activities"));
    
    const activitiesData = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const activity = doc.data();

      activity.id = doc.id
      /* COLLABORATORS REFERENCES */
      const collaborators = await Promise.all(activity.collaborators.map(async (collaborator) => {
        console.log(collaborator.id);
        const collaboratorDocument = await getOneDoc(collaborator.id, 'collaborators');
        return {
          name: collaboratorDocument.name,
          surname: collaboratorDocument.surname,
          id: collaboratorDocument.id
        };
      }));
      activity.collaborators = collaborators;

      /* INSTANCES REFERENCES */
      const instances = await Promise.all(activity.instances.map(async (instance) => {
        console.log(instance.id);
        const instanceDocument = await getOneDoc(instance.id, 'activityInstances');
        return instanceDocument;
      }));
      
      activity.instances = instances.length;

      return activity;
    }));
    return activitiesData;
  }

  async function getOneDoc(id, collection){
    const docRef = doc(getFirestore(), collection, id);
    const docSnap = await getDoc(docRef);
    return docSnap.data()
  }

  async function test(){
    const docRef = doc(getFirestore(), 'collaborators', 'DtkIoEQOjDelZzNYp8yf');
    const docSnap = await getDoc(docRef);
    return docSnap.data()
  }

  return {
    getActivities
  }
}