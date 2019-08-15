Gofish
===

Creates a Node JS module from Aquarium's Javascript API code. The commands
    
    clone https://github.com/klavinslab/gofish.git
    cd gofish
    npm init --yes 
    npm install
    node gofish.js yourgithubusername yourgithubpassword

create a file called `aquarium.js`. You can then do

    const AQ = require('./aquarium');

