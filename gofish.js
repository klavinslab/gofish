const request = require('request');
const  fs = require('fs');

const username = process.argv[2];
const password = process.argv[3];
const api_url = `https://${username}:${password}@api.github.com`;
const aq_url = api_url + '/repos/klavinslab/aquarium/contents';
const models_url = aq_url + '/app/assets/javascripts/models';


const http_options = {
  json: true,
  headers: { 
    'User-Agent': "GoFish"
  }
};

function authenticate() {
  return new Promise(function(resolve,reject) {
    request(api_url, http_options, (err,res,body) => {
      console.log(body);
      if (body.current_user_url) {
        resolve(true)
      } else {
        reject("Could not authorize: " + body.message);
      }
    });
  });
}

function get_paths() {
  console.log("discovering file names");
  return new Promise(function(resolve,reject) {
    request(models_url, http_options, (err,res,contents) => {
      if (err) { reject(err); }
      let paths = [];
      for ( var i=0; i<contents.length; i++ ) {
        paths.push(contents[i].path)
      }
      if ( paths.length == 0 ) { reject("could not connect. are you authenticated?"); }      
      console.log("found " + paths.length + " js files");
      resolve(paths);
    });
  });
}

function get_content(path) {
  return new Promise(function(resolve,reject) {
    request(aq_url + "/" + path, http_options, (err,res,body) => {
      console.log("retrieved " + path.split('/').pop());
      if (err) { reject(err); }
      let buf = new Buffer(body.content, 'base64');
      resolve(`\n//\n// ${path}\n//\n\n` + buf.toString('ascii'));
    });
  });  
}

function get_all_content(paths) {

  console.log("getting files");
  let promises = [];
  for ( var i=0; i<paths.length; i++ ) {
    promises.push(get_content(paths[i]));
  }
  return Promise.all(promises);

}

function compile_js(js_files) {
  console.log("compiling javascript");
  let str = "";
  for (var i=0; i<js_files.length; i++) {
    str += js_files[i];
  }
  str += "\nmodule.exports = AQ;\n";
  return str;
}

function write_js(js) {
  console.log("writing to aquarium.js");
  fs.writeFile('aquarium.js', js, function (err) {
    if (err) throw err;
    console.log('done!');
  });
}

authenticate()
  .then(get_paths)
  .then(get_all_content)
  .then(compile_js)
  .then(write_js)
  .catch(msg => {
    console.log(msg);
    console.log("Usage: node gofish.js username password");
  });