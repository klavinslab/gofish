//
// gofish sequel
//

AQ.config = {
  aquarium_url: "http://localhost:3000"
};

AQ.next_record_id = 0;

AQ.login = function(username, password) {
    return new Promise(function(resolve,reject) {
        var data = { json: { session: { login: username, password: password } } };
        request.post(AQ.config.aquarium_url+"/sessions.json", data, function (error, response, body) {
            console.log("got post result");
            if (!error && response.statusCode == 200) {
                AQ.login_headers = response.headers;
                console.log("AQ: LOGIN OK")
                resolve(body);
            } else {
                console.log("AQ: COULD NOT LOG IN");
                reject("Could not log in to Aquarium server. Check Nemo's settings.")
            }
        })
    })
}

AQ.login_interactive = function() {

    var rl = readline.createInterface(process.stdin, process.stdout);

    function hidden(query, callback) {

      var stdin = process.openStdin(),
        i = 0;

      process.stdin.on("data", function(char) {
        char = char + "";
        switch (char) {
            case "\n":
            case "\r":
            case "\u0004":
                stdin.pause();
                break;
            default:
                process.stdout.write("\033[2K\033[200D" + query + Array(rl.line.length+1).join("*"));
                i++;
                break;
        }
    });

    rl.question(query, function(value) {
        rl.history = rl.history.slice(1);
        callback(value);
    });

    }

    return new Promise(function(resolve, reject) {

    rl.question("username> ", username => {
        hidden('password> ', password => {
        rl.close();
        AQ.login(username,password).then(resolve).catch(reject);
        })
    })

    })

}

AQ.get = function(path) {

    var headers;

    if ( AQ.login_headers ) {
        headers = {
        cookie: AQ.login_headers["set-cookie"]
        }
    } else {
        headers = {};
    }

    return new Promise(function(resolve,reject) {
        request.get({
            url: AQ.config.aquarium_url + path,
            headers: headers },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
            resolve({data: body});
            } else {
            console.log([error,response,body])
            reject({error: error, statusCode: response.statusCode, body: body});
            }
        })
    });

};

AQ.post = function(path,data) {

    var headers;

    var c = AQ.login_headers["set-cookie"];
  
    var c = AQ.login_headers["set-cookie"];
    let remember_cookie = c[0].replace('remember_token_development', 'remember_token');
    if ( !c.includes(remember_cookie) ) {
      c.push(remember_cookie);
    }  
  
    if ( AQ.login_headers ) {
      headers = {
          cookie: c
      }
    } else {
      headers = {};
    }
    
    return new Promise(function(resolve,reject) {
      request({
            method: 'post',
            url: AQ.config.aquarium_url + path,
            headers: headers,
            json: data
          },
          function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve({ data: body});
            } else {
                console.log(data)
                reject({error: error, statusCode: response.statusCode, body: body});
            }
          })
    });

};
