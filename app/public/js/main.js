socket = io();
const feedback = document.getElementById('feedback');
const message = document.getElementById('message');
const write = document.getElementById('write');
const output = document.getElementById('output');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('username');
let roomname = 'Chat';

document.getElementById('room').innerHTML = `Welcome to Chat room`;

const todos = (valor, id) => {
  entrarALaSala(valor);
  active(id);
  clearBox();
};
const active = (valor) => {
  document.getElementById('r1').disabled = false;
  document.getElementById('r2').disabled = false;
  document.getElementById('r3').disabled = false;
  document.getElementById('r4').disabled = false;
  document.getElementById(valor).disabled = true;
  
};

const clearBox = () => {
  document.getElementById('output').innerHTML = '';
  document.getElementById('write').innerHTML = '';
};

function entrarALaSala(sala) {
  document.getElementById('room').innerHTML = `Welcome to ${sala} room`;
  roomname = sala;
  socket.emit('switchRoom', {
    username: username,
    roomname: sala,
  });
}

function render(data) {
    console.log(data)
    let messages = data.map(function(data, index)  {
      return (`<div><strong>${data.username}</strong>:
      <strong>${data.message}</strong>`);
    }).join(" ");
    write.innerHTML = messages
}
socket.on('messages', (data) => {
  render(data)
})
socket.emit('adduser', {
  username: username,
  roomname: roomname,
});

//Displaying the message sent from user
socket.on('updatechat', (username, data) => {
  write.innerHTML += `<p ><strong>${username} : ${data}</strong> </p>`;
  feedback.innerHTML = '';
});

//Sending data when user clicks send
send.addEventListener('click', () => {
  socket.emit('sendchat', {
    username: username,
    message: message.value,
    roomname: roomname,
  });
  message.value = '';
});

//Displaying if new user has joined the room
socket.on('adduser', (data) => {
  output.innerHTML += `<p id="unido"> <strong>${data} </strong></p>`;
});
