const socket = new WebSocket('wss://echo-ws-service.herokuapp.com');

const inputButton = document.querySelector(".chat__button-submit");
const GPSButton = document.querySelector(".chat__button-GPS");

// Открытие соединения
socket.addEventListener('open', function (event) {
    console.log('Connected to server');
});

// Обработка входящих сообщений
socket.addEventListener('message', function (event) {
    console.log('Message from server:', event.data);
    // Вывод сообщения в чат
    const chatWindow = document.querySelector('.chat__body');
    const messageElement = `
        <div class="chat__server-message">
            ${event.data}
        </div>`;
        chatWindow.insertAdjacentHTML("beforeend", messageElement);
});

// Отправка сообщения на сервер
const sendMessage = () => {
    if (socket.readyState === WebSocket.OPEN) {
        const inputElement = document.querySelector('.chat__input');
        const message = inputElement.value;
        const chatWindow = document.querySelector('.chat__body');
        const messageElement = `
        <div class="chat__user-message">
            ${message}
        </div>`;
        chatWindow.insertAdjacentHTML("beforeend", messageElement);

        socket.send(message);
    } else {
        console.log('Cannot send message: WebSocket is not open');
    }
}

// Получение гео-локации пользователя и отправка на сервер
const sendLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        socket.send(`Location: ${latitude}, ${longitude}`);
        // Вывод ссылки на карту в чат
        const chatWindow = document.querySelector('.chat__body');
        const locationElement = document.createElement('a');
        locationElement.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
        locationElement.textContent = 'View on map';
        chatWindow.appendChild(locationElement);
    });
}

inputButton.addEventListener("click", sendMessage);
GPSButton.addEventListener("click", sendLocation);
