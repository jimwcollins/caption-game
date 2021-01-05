import { firebase } from "../firebase/config";
import { randomCodeGen } from "./utils";

const rooms = firebase.firestore().collection("rooms");

const createRoom = (username) => {
  const roomCode = randomCodeGen();
  return rooms
    .doc(roomCode)
    .collection("users")
    .doc()
    .set({ host: true, name: username, points: 0 });
};

const joinRoom = (roomCode, username) => {
  return rooms
    .doc(roomCode)
    .collection("users")
    .doc()
    .set({ host: false, name: username, points: 0 });
};

// const getUsersInRoom = ()=>{
//   return rooms.collection('users').get().then(()=>{
//     snapshot.docs.map(doc => console.log(doc.data()));
// }))

module.exports = { rooms, createRoom, joinRoom };
