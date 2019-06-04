# NODE SSH BOILERPLATE (P.O.C.)

### Set UP
* Create `.env` file at the root directory
* Add the following keys with the correct values for your own SSH Server:
  * SSH_USER_NAME=yourSshUserName
  * SSH_PASS=yourPassword
  * SSH_HOST=127.0.0.1 or Your SSH Host/IP Address

### Endpoints
* `/api/run-process/:id` : Will attempt to SSH `echo RUNNING PROCESS_ID: ${id}`