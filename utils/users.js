const users = [];

function userJoin(id, username, room) 
{
    const user = { id, username, room };
  
    users.push(user);
  
    return user;
}

//Get the current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

function userDiconnects(id)
{
    const index = users.findIndex(user => user.id === id);

    if(index !== -1)
    {
        return users.splice(index, 1)[0];
    }
}

function RoomUsers(room)
{
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userDiconnects,
    RoomUsers
};