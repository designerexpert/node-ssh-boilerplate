require('dotenv').config();
const express = require('express');
const server = express();
const PORT = process.env.PORT || 8080;
const nodeSSH = require('node-ssh');
const OS = require('os')
ssh = new nodeSSH();

const password = process.env.SSH_PASS;
const userName = process.env.SSH_USER_NAME;
const sshHost = process.env.SSH_HOST

ssh.connect({
    host: sshHost,
    username: userName,
    password,
    tryKeyboard: true,
    onKeyboardInteractive: (name, instructions, instructionsLang, prompts, finish) => {
        if (prompts.length > 0 && prompts[0].prompt.toLowerCase().includes('password')) {
            finish([password])
        }
    }
});

server.get('/api/run-process/:id', (req, res, next) => {
    const PROCESS_ID = req.params.id;
    ssh.exec(
        `echo "RUNNING PROCESS_ID: ${PROCESS_ID}"`
    ).then(result => {
        const parsed = result.toString('utf8').split(OS.EOL).join(' ');
        res.send({ STDOUT: parsed })

    }).catch(err => {
        const parsed = err.message.split(OS.EOL).join(' ');
        res.status(500).send({ errorMessage: parsed })
    })
});

server.listen(PORT, () => {
    console.log(`< Server Running on Port: [${PORT}]`)
})