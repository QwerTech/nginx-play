var fs = require('fs');

var STORAGE = "/etc/nginx/contracts.json"

var data = [];
function hello(r) {
    r.return(200, data);
}
// /undefined/Login/d2e10e91-837d-3b53-a29b-beb20cfd218d
// /undefined/Login/d2e1e881-837d-3b53-a29b-beb20cfd218d
// http://localhost:8080/undefined/Login/d28e8e91-837d-3b53-a29b-beb20cfd218d
// http://localhost:8080/undefined/Login/d2e10e91-837d-3b53-a29b-beb20cfd218d/asd
// http://localhost:8080/undefined/login/d2e10e91-837d-3b53-a29b-beb20cfd218d/asd
// http://localhost:8080/undefined/login/d2e10e91-837d-3b53-a29b-beb20cfd218d?a=1
// http://localhost:8080/undefined/d2e10e91-837d-3b53-a29b-beb20cfd218d?a=1
var uuidRegex = /(\/\w*)?\/\w*\/(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})([\/?].*)?$/i;

function shouldProxy(r){
	//r.error(njs.dump(r));
	//r.error(njs.dump(process.env));
	
	var contractId = findContractId(r.uri, uuidRegex, r) || findContractId(r.headersIn.Referer, uuidRegex, r);
	if(!contractId){		
		r.error(`Haven't found contractId in ${r.uri} or ${r.headersIn.Referer}`);
		return false;
	}
	var result = data.includes(contractId);
	r.log(`shouldProxy: ${result}`);
	return result;
		
}
function findContractId(str, regex, r){
	if(!str){
		return false;
	}
	var match = str.match(regex);
	if(match && match[2]){
		r.log(`${str} matched by ${regex}`);
		return match[2];
	}	
	r.log(`${str} don't matched by ${regex}`);
	return false;
}
function read(){	
	ngx.log(ngx.INFO, `Reading uuids`);
	try{
		var newData = JSON.parse(fs.readFileSync(STORAGE));
		if(JSON.stringify(newData) !== JSON.stringify(data)){
			ngx.log(ngx.INFO, `Read uuids to proxy ${njs.dump(newData)}`);
			data = newData;
		}
	}
	catch(e){
		ngx.log(ngx.ERR, njs.dump(e));
	}
	setTimeout(read, 1000);
}
var reading = reading || read();

export default {hello, shouldProxy};