async function login() {

  const { user, pwd } = collectFormData(document.querySelector('#loginForm'));

  const resp = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: user, password: pwd })
  });

  if (resp.status === 200) {
    alert('login successful');
    console.log(document.cookie);
  }
  else {
    alert('login failed');
    console.log(await resp.text());
  }
  clearLoginForm();
}

async function logout() {
  const resp = await fetch('/auth/logout', {
    method: 'POST'
  });

  if (resp.status === 200) {
    alert('logout successful');
  }
  else {
    alert('logout failed');
    console.log(await resp.text());
  }
  clearLoginForm();
}


function clearLoginForm() {
  let userTextField = document.querySelector('#user');
  let pwdTextField = document.querySelector('#pwd');
  userTextField.value = '';
  pwdTextField.value = '';
}



async function getData() {
  console.log('load data from server');
  const resp = await fetch('/api/secure-resource');

  if (resp.status === 200) {
    const data = await resp.json();
    renderData(data);
  } else {
    alert(`loading data failed with status code ${resp.status}`);
    console.log(await resp.text());
  }
}


function renderData(data) {
  const dataList = document.getElementById('dataList');

  const dataItems = [];
  for (const d of data) {
    dataItems.push(createElementWithText('li', d.text, 'list-group-item'));
  }

  dataList.replaceChildren(...dataItems);
}


async function postData() {
  let data = collectFormData(document.getElementById('dataForm'));

  const resp = await fetch('/api/secure-resource', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (resp.status === 201) {
    let textField = document.querySelector('#dataForm #text');
    textField.value = ''
    console.log('data created');
  }
  else {
    alert(`posting data failed with status code ${resp.status}`);
    console.log(await resp.text());
  }
}


function createElementWithText(tagName, text, cssClass = undefined) {
  const newElement = document.createElement(tagName);
  newElement.textContent = text;
  if (cssClass)
    newElement.className = cssClass;
  return newElement;
}


function collectFormData(formElement) {
  // Get array of form fields
  let fields = formElement.querySelectorAll('input, select, textarea');

  // Create json object
  let data = {};

  // Iterate over fields and save data
  fields.forEach(field => {
    // Check if the element is a checkbox
    if (field.type === 'checkbox') {
      // Set the value of the object with the checkbox name to true or false
      data[field.name] = field.checked;

    } else {
      if (field.type === 'number') {
        field.name && (data[field.name] = Number(field.value));
      } else {
        field.name && (data[field.name] = field.value);
      }
    }
  });

  return data;
}
