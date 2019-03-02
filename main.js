
let express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer'); 
var upload = multer();
let port = 22001;
let server = express();

server.use(bodyParser.json()); // for parsing application/json
server.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//添加统一异常处理
server.use(function(req,res,next){
    let domain = require('domain');
    let d = domain.create();
    d.on('error',function(err){
        console.log("发送错误异常:",err);
        res.send({"code":-100,"msg":"server error"});
    });
    d.add(req);
    d.add(res);
    d.run(next);
});

process.on('uncaughtException',function(error){
    console.log(error);
});

const createInfuraProvider = require('./src/createProvider')
const provider = createInfuraProvider({ network: 'mainnet' })

async function getRemote(payload){
    return new Promise((resolve, reject) => {
        provider.sendAsync(payload,function(err,res){
            if (err) {reject(err)}
            else resolve(res);
        });
    })
}

server.post('/',upload.array(), async function (request,response){
    let payload  = request.body;
    let resp = await getRemote(payload)
    console.log("11---",resp)
    if (resp !== null) {
        return response.send(resp);
    }
    return response.send(resp);
})

server.listen(port);
console.log("eth代理服务启动...端口号:",port);

