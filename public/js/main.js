const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get username and room name
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

const socket = io();

//Join room
socket.emit('joinroom', {username, room});

//Get room and users
socket.on('roomusers', ({room, users}) => {
  outputRoomName(room);
  outputUsers(users);
})

//Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  //Scroll down to the message
  chatMessages.scrollTop = chatMessages.scrollHeight;

});

//Send message
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to Server
  socket.emit('chatMessage', msg);

  //Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//Output message 
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta"> ${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;

  document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room)
{
  roomName.innerText = room;
}

function outputUsers(users)
{
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}  
  `;
}