class Chat {
    constructor() {
        this.messages = [];
    }

    addUserMessage(text) {
        this.messages.push({ tag: "user", text: text });
    }

    addApiMessage(text) {
        this.messages.push({ tag: "api", text: text });
    }

    getMessages() {
        return this.messages;
    }
}

export default Chat;