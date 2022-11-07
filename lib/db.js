import firebase from './firebase'

const firestone = firebase.firestore();

export function createUser(uid, data) {
    return firestone
            .collection('users')
            .doc(uid)
            .set({uid, ...data}, { merge: true})
}

export function updateUser(uid, data) {
    return firestone.collection("users").doc(uid).update(data)
}
