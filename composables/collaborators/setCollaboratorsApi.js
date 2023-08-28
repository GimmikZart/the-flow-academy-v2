import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';



export default function() {
  // Ottieni un riferimento alla collezione "collaborators"
  const collaboratorsCollection = collection(getFirestore(), 'collaborators');
  // Ottieni un riferimento alla collezione "payments"
  const paymentsCollection = collection(getFirestore(), 'payments');
  // Ottieni un riferimento a un documento di collaborators
  const getCollaboratorReference = async (collaboratorId) => {
    return await doc(getFirestore(), 'collaborators', collaboratorId);
  }
  
  const addCollaborator =  async (newCollaborator) => {
    if(newCollaborator.dateOfBirth != null) newCollaborator.dateOfBirth = new Date(newCollaborator.dateOfBirth) 
    if(newCollaborator.firstContact != null) newCollaborator.firstContact = new Date(newCollaborator.firstContact)
    const collaboratorOnjPlain = newCollaborator.toPlainObject();
    await addDoc(collaboratorsCollection, collaboratorOnjPlain);
    return newCollaborator;
  }

  const editCollaborator = async (editCollaborator) => {
    editCollaborator.dateOfBirth = new Date(editCollaborator.dateOfBirth)
    editCollaborator.firstContact = new Date(editCollaborator.firstContact)
    const collaboratorRef = await getCollaboratorReference(editCollaborator.id);
    await updateDoc(collaboratorRef, editCollaborator);
  };

  const deleteCollaborator = async (removeCollaborator) => {
    const collaboratorRef = await getCollaboratorReference(removeCollaborator.id);
    await deleteDoc(collaboratorRef);
  };

  const unsubscribeCollaborator = async (unsubscribeCollaborator) => {
    unsubscribeCollaborator.status = 2
    unsubscribeCollaborator.activities = []
    const collaboratorRef = await getCollaboratorReference(unsubscribeCollaborator.id);
    await updateDoc(collaboratorRef, unsubscribeCollaborator);
  };

  const addPayment = async (newPayment) => {
    newPayment.person = await getCollaboratorReference(newPayment.person.id);
    const paymentOnjPlain = newPayment.toPlainObject();
    await addDoc(paymentsCollection, paymentOnjPlain);
    return newPayment;
  }

  return {
    addCollaborator,
    addPayment,
    editCollaborator,
    deleteCollaborator,
    unsubscribeCollaborator
  }
}