"use strict";

/**
 * @typedef {{
 * text: string;
 * user: string;
 * id: number;
 * timestamp: number;
 * }} Message
 */

const MSG_ID_PREFIX = "msg_";

/**
 * @type {Message[]}
 */
let MESSAGES = [];
let lastMsgId;

function initClient() {
    console.log("init client...");
}

/**
 *
 * @param {boolean?} longPolling
 */
async function loadMessages(longPolling) {
    console.log("load messages from server");

    const query = {};
    const headers = { Accept: "application/json" };

    if (lastMsgId) query.idGreaterThan = lastMsgId;
    if (longPolling) headers["x-long-polling"] = "true";

    await fetch("/api/messages?" + new URLSearchParams(query).toString(), {
        method: "GET",
        headers,
    })
        .then((res) => {
            if (!res.status == 200) return console.log(res.statusText);
            return res.json();
        })
        .then(onMessagesLoaded);
}

/**
 *
 * @param {Message[]} messages
 */
function onMessagesLoaded(messages) {
    if (messages.length !== 0) {
        MESSAGES = [...MESSAGES, ...messages];
        lastMsgId = messages[messages.length - 1].id;
        renderMessages(MESSAGES);
    }
}

/**
 *
 * @param {Message[]} messages
 */
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

    fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify(msgData),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => {
        if (res.status === 201) {
            console.log("message created");
        } else {
            console.log(res.statusText);
        }
    });

    let textField = document.querySelector("#msgForm #text");
    textField.value = "";
}

async function shortPolling(ms) {
    if (!ms) ms = 500;
    const interval = setInterval(loadMessages, ms);
    return () => clearInterval(interval);
}

async function longPolling() {
    while (true) {
        await loadMessages(true);
    }
}

shortPolling();
// longPolling();

/* HELPER Functions */

function createElementWithText(tagName, text, cssClass = undefined) {
    const newElement = document.createElement(tagName);
    newElement.textContent = text;
    if (cssClass) newElement.className = cssClass;
    return newElement;
}

function toQueryString(query) {
    if (Object.keys(query).length === 0) return "";

    let queryString = "?";
    for (let k in query) {
        queryString += `${k}=${query[k]}&`; // without escaping ATM...
    }

    return queryString;
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
