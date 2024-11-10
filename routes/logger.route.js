const express = require("express");
const router = express.Router();

router.get("/", (req, res)=>{
    res.json("Hello from the logger");
})

router.get("/log", (req, res)=>{
    console.log(req.url, req.method, Date.now());
    res.send(req.url, req.method, Date.now())
})

module.exports = router;