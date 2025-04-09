import express from "express";

const app = express();

app.use(
    express.text({
        type: "*/*",
    })
);

app.use("/log", (req, res, next) => {
    console.log(req.body);
    console.log(req.query);
    res.sendStatus(200);
});

app.listen(9090, () => {
    console.log("Attacker server running on port 9090");
});
