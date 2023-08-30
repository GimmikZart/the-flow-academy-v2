import { getFirestore, doc, collection, query, where, getDocs, getDoc } from 'firebase/firestore'

export default function() {

  const getActivityCategoryList =  async () => {
    const querySnapshot = await getDocs(collection(getFirestore(), "activityCategories"));
    
    const activityCategoryData = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const activityCategory = doc.data();

      activityCategory.id = doc.id

      return activityCategory;
    }));
    return activityCategoryData;
  }

  async function getOneActivityCategory(id){
    const docRef = doc(getFirestore(), 'activiryCategories', id);
    const docSnap = await getDoc(docRef);
    return docSnap.data()
  }

  return {
    getActivityCategoryList,
    getOneActivityCategory
  }
}