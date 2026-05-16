const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

const VERIFY_TOKEN = "holidays360_verify_token";

/*
YOUR META DETAILS
*/
const ACCESS_TOKEN = 'EAAW8MZCknVwQBRZAFiQ80FeRnammg2vy7yBafRNfzuRhaHXm9vLBK9ooabSxummNXE9M8vqcRfQ4UObLbdYO8oEgIrkVg42JbA14CQYZACk46IWijZB2AZCafpJ6TjwpGuMAkUEnWPDUGODIwrlhKtb5phYJGWrfI3PLTTJLpf3x7dPmKk7e8YvBGoVv41yGMH1Sg9iRZA20UP7xSppD3oxxYFokBrUqGuMopO1ZA7ZAtFZBGfOupmAybZAT5SRSJ646BapEcGuZALn3nnNQyNax8tl';
const PHONE_NUMBER_ID = '1142820578910792';

/*
VERIFY WEBHOOK
*/
app.get('/webhook', (req, res) => {

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {

        res.status(200).send(challenge);

    } else {

        res.sendStatus(403);
    }
});

/*
RECEIVE MESSAGES
*/
app.post('/webhook', async (req, res) => {

    try {

        const message =
            req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

        if (message) {

            const from = message.from;
            const text = message.text?.body?.toLowerCase();

            console.log('Message:', text);

            let reply = "Welcome to Holidays360";

            /*
            SIMPLE AUTO REPLIES
            */

            if (text.includes('kerala')) {

                reply =
                    "Kerala packages start from ₹12,999. Duration: 4N/5D.";

            } else if (text.includes('maldives')) {

                reply =
                    "Maldives honeymoon packages start from ₹45,000.";

            } else if (text.includes('contact')) {

                reply =
                    "Please call +91XXXXXXXXXX";

            } else if (text.includes('price')) {

                reply =
                    "Please share destination and travel dates.";

            }

            /*
            SEND WHATSAPP MESSAGE
            */

            await axios.post(
                `https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: from,
                    type: 'text',
                    text: {
                        body: reply
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${ACCESS_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

        }

        res.sendStatus(200);

    } catch (error) {

        console.log(error.response?.data || error.message);

        res.sendStatus(500);
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});