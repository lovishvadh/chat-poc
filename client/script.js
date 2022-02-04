
var socket = io()

const name = prompt('Welcome! Please enter your name:')

socket.emit('new-connection', { username: name })

const chatContainer = document.getElementById('chat-container')
const messageInput = document.getElementById('messageInput')
const messageForm = document.getElementById('messageForm')

messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  if (messageInput.value !== '') {
    let newMessage = messageInput.value
    socket.emit('new-message', { user: socket.id, message: newMessage })
    addMessage({ message: newMessage }, true)
    messageInput.value = ''
  } else {
    messageInput.classList.add('error')
  }
})

socket.on('welcome', function (data) {
  console.log('📢 welcome event >> ', data)
  addMessage(data)
})

socket.on('broadcast-message', (data) => {
  console.log('📢 broadcast-message event >> ', data)
  addMessage(data)
})

socket.on('users-list', (data) => {
  console.log('📢 users-list event >> ', data)
})

messageInput.addEventListener('keyup', (e) => {
  messageInput.classList.remove('error')
})

function addMessage(data, isSelf = false) {
  const messageElement = document.createElement('div')
  messageElement.classList.add('message')
  let imgElement = document.createElement('img')
  imgElement.src = `${data.message}`;

  if (isSelf) {
    messageElement.classList.add('my-message')
    messageElement.innerText = `${data.message}`
  } else {
    if (data.user === 'server') {
      messageElement.innerText = `${data.message}`
    } else {
      messageElement.classList.add('others-message')
      messageElement.innerText = `${data.user}: ${data.message}`
    }
  }
  messageElement.append(imgElement);

  chatContainer.append(messageElement)
}
