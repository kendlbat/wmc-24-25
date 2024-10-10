const MSG_ID_PREFIX = "msg_";

/**
 * @type {WebSocket | undefined}
 */
let ws;
let messages = [];

function initClient() {
    console.log("init client...");

    ws = new WebSocket("ws://localhost:8080/api/messages");
    ws.onopen = (ev) => {
        console.log("connected to server");
        document.getElementById("btnPostMsg").disabled = false;
    };
    ws.onmessage = (ev) => {
        const newMsgs = JSON.parse(ev.data);
        messages = [...messages, ...newMsgs];
        console.log(`received ${newMsgs.length} messages`);
        renderMessages(messages);
    };
}

function renderMessages(messages) {
    const messageList = document.getElementById("messageList");

    const listItems = [];
    for (const msg of messages) {
        listItems.push(
            createElementWithText(
                "li",
                `#${msg.id} - ${msg.user}: ${msg.text}`,
                "list-group-item"
            )
        );
    }

    messageList.replaceChildren(...listItems);
}

function postMessage() {
    let msgData = collectFormData(document.getElementById("msgForm"));
    console.log(msgData);

    if (ws) {
        ws.send(JSON.stringify(msgData));
    }

    let textField = document.querySelector("#msgForm #text");
    textField.value = "";
}

/* HELPER Functions */

function createElementWithText(tagName, text, cssClass = undefined) {
    const newElement = document.createElement(tagName);
    newElement.textContent = text;
    if (cssClass) newElement.className = cssClass;
    return newElement;
}

function collectFormData(formElement) {
    // Get array of formfields
    let fields = formElement.querySelectorAll("input, select, textarea");

    // Create json object
    let data = {};

    // Iterate over fields and save data
    fields.forEach((field) => {
        // Check if the element is a checkbox
        if (field.type === "checkbox") {
            // Set the value of the object with the checkbox name to true or false
            data[field.name] = field.checked;
        } else {
            if (field.type === "number") {
                field.name && (data[field.name] = Number(field.value));
            } else {
                field.name && (data[field.name] = field.value);
            }
        }
    });

    delete data.id;
    return data;
}
