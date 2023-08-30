import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
/* import 'firebase/storage';
import { storage, storageRef, ref, selectedFile, handleFileChange, uploadFile } from 'firebaseStorage'; */



export default function() {


  // Ottieni un riferimento alla collezione "activitys"
  const activitiesCollection = collection(getFirestore(), 'activities');
  // Ottieni un riferimento a un documento di activitys
  const getActivityReference = async (activityId) => {
    return await doc(getFirestore(), 'activities', activityId);
  }
  
  const addActivity =  async (newActivity) => {
    const activityOnjPlain = newActivity.toPlainObject();
    await addDoc(activitiesCollection, activityOnjPlain);
    return newActivity;
  }

  const editActivity = async (editActivity) => {
    console.log({editActivity});
    editActivity = convertUndefinedToNull(editActivity)
    const activityRef = await getActivityReference(editActivity.id);
    await updateDoc(activityRef, editActivity);
  };

  const deleteActivity = async (removeActivity) => {
    const activityRef = await getActivityReference(removeActivity.id);
    await deleteDoc(activityRef);
  };

 /*  const testUpload = async (selectedFile) => {
    const fileRef = ref()    
    await fileRef.put(selectedFile.value);
  } */

  return {
    addActivity,
    editActivity,
    deleteActivity
  }
}