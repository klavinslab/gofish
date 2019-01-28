const AQ = require("./aquarium");

AQ.login_interactive()
  .then(() => AQ.OperationType.all())
  .then(console.log)
  .catch(console.log);