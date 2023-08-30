import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';



export default function() {
  // Ottieni un riferimento alla collezione "activityCategorys"
  const activityCategoriesCollection = collection(getFirestore(), 'activityCategories');
  // Ottieni un riferimento a un documento di activityCategorys
  const getActivityCategoryReference = async (activityCategoryId) => {
    return await doc(getFirestore(), 'activityCategories', activityCategoryId);
  }
  
  const addActivityCategory =  async (newActivityCategory) => {
    const activityCategoryOnjPlain = newActivityCategory.toPlainObject();
    console.log({activityCategoryOnjPlain});
    await addDoc(activityCategoriesCollection, activityCategoryOnjPlain);
    return newActivityCategory;
  }

  const editActivityCategory = async (editActivityCategory) => {
    const activityCategoryRef = await getActivityCategoryReference(editActivityCategory.id);
    await updateDoc(activityCategoryRef, editActivityCategory);
  };

  const deleteActivityCategory = async (activityCategoryToRemove) => {
    const activityCategoryRef = await getActivityCategoryReference(activityCategoryToRemove.id);
    await deleteDoc(activityCategoryRef);
  };

  return {
    addActivityCategory,
    editActivityCategory,
    deleteActivityCategory
  }
}