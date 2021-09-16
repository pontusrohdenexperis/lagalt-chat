const users = [];

const addUser = ({ id, name, room }) => {
  //name = name.trim().toLowerCase();
  //room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );


  if (!name || !room) {
    return { error: "Username and room are required." };
  }

  if (existingUser) {
    console.log(`Existing user ${name} has joined room ${room}.`)
    //const existingUser = getUser(id);
    const user = getUserByNameAndRoom(name, room);
    //console.log("EXISTING USER:")
    //console.log(user);
    return { user, existingUser };
    //return { error: "Username is taken." };
    //return { existingUser };
  }

  const user = { id, name, room };

  users.push(user);
  console.log(`User ${name} has been added.`);

  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const removeUserByNameAndRoom = (name, room) => {
  const index = users.findIndex((user) => user.name === name && user.room === room);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

const getUser = (id) => users.find((user) => user.id === id);

const getUserByNameAndRoom = (name, room) => users.find((user) => user.name === name && user.room === room);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, removeUserByNameAndRoom, getUser, getUserByNameAndRoom, getUsersInRoom };
