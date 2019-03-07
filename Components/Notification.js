class Notification {
    constructor() {
        this.notificationBox = document.querySelector('#notification');
        this.timeoutId = null
    }
    emit(msg,type=undefined) {
        this.notificationBox.classList.remove('is-danger','is-primary')
        if (this.timeoutId) {
            clearTimeout(this.timeoutId)
        }
        this.notificationBox.innerText = msg;
        const classType = type === 'error' ? 'is-danger' : 'is-primary'
        this.notificationBox.classList.add('notification-is-active',classType);
        this.timeoutId = setTimeout(() => {
            this.notificationBox.classList.remove('notification-is-active')
        }, 4000)
    }
}

module.exports = Notification