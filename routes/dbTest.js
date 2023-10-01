const express = require('express');
const router = express.Router();

// mongoose 불러오기
const { mongoose } = require('../database/mongoose');

// 스키마와 모델 구성
const testSchema = new mongoose.Schema({
    testKey: String
});

const testModel = mongoose.model('dbTest', testSchema);


router.get('/:testValue', (req, res) => {
    testModel.findOne({
        testKey: req.params.testValue
    })
    .then((document) => {
        if (document) {
            res.send("Found!");
        }
        else {
            res.send("Not Found!");
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(400).send("Error!");
    });
});

router.post('/:testValue', (req, res) => {
    testModel.create({
        testKey: req.params.testValue
    })
    .then((isSuccessful) => {
        if (isSuccessful) {
            res.send("Document Created!");
        }
        else {
            res.send("Document Not Created!");
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(400).send("Error!");
    });
});

module.exports = router;