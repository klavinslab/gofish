Gofish
===

Creates a Node JS module from Aquarium's Javascript API code. The commands
    
    clone https://github.com/klavinslab/gofish.git
    cd gofish
    npm init --yes 
    npm install
    node gofish.js yourgithubusername yourgithubaccesstoken

create a file called `aquarium.js`. You can then do

    const AQ = require('./aquarium');

You can't use your github password here because that method is rate limited. Use a token instead: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
