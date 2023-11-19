
export const userTypes = {
    CLIENT : 0,
    COLLABORATOR: 1
}

export function isClient(value){
    return value == userTypes.CLIENT
}

export function isCollaborator(value){
    return value == userTypes.COLLABORATOR
}
