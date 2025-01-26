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
