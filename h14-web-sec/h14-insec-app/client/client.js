async function login() {
    const { user, pwd } = collectFormData(document.querySelector("#loginForm"));

    // demonstrating alternative way of transferring key=values pairs instead of using JSON format
    let formContent = new URLSearchParams({
        username: user,
        password: pwd,
    });

    // create a string in the form "username=alice&password=always"
    let formContentAsString = formContent.toString();

    const resp = await fetch("/login", {
        method: "POST",
        // encoding must be specified as follows
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formContentAsString,
    });

    if (resp.status === 200) {
        alert("login successful");
    } else {
        alert("login failed");
        console.log(await resp.text());
    }
}

async function getData() {
    console.log("load data from server");
    const resp = await fetch("/posts");

    if (resp.status === 200) {
        const data = await resp.json();
        renderData(data);
    } else {
        alert(`loading data failed with status code ${resp.status}`);
        console.log(await resp.text());
    }
}

function renderData(data) {
    const dataList = document.getElementById("dataList");

    const dataItems = [];
    for (const d of data) {
        dataItems.push(
            createElementWithText(
                "li",
                `(${d.id}) ${d.title}: ${d.content}`,
                "list-group-item"
            )
        );
    }

    dataList.replaceChildren(...dataItems);
}

async function postData() {
    let data = collectFormData(document.getElementById("dataForm"));
    let id = Math.floor(Math.random() * 10000);

    const resp = await fetch(`/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
    });

    if (resp.status === 200) {
        alert("post created");
    } else {
        alert(`posting data failed with status code ${resp.status}`);
        console.log(await resp.text());
    }
}

function createElementWithText(tagName, text, cssClass = undefined) {
    const newElement = document.createElement(tagName);
    newElement.innerText = text;

    if (cssClass) newElement.className = cssClass;
    return newElement;
}

function collectFormData(formElement) {
    // Get array of form fields
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

    return data;
}
