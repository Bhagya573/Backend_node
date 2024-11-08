const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const cluster = require('cluster');
const os = require('os');
const util = require('util');
const async_hooks = require('async_hooks');

// 1. Buffers Example
function bufferExample() {
    const buffer = Buffer.from('Hello, Node.js!', 'utf-8');
    console.log('Buffer:', buffer);
    console.log('Buffer as string:', buffer.toString('utf-8'));
}

// 2. Streams Example
function streamExample() {
    const filePath = path.join(__dirname, 'sample.txt');
    const readStream = fs.createReadStream(filePath, 'utf8');
    
    readStream.on('data', chunk => console.log('Reading chunk:', chunk));
    readStream.on('end', () => console.log('Finished reading the file'));
    readStream.on('error', err => console.log('Error reading file:', err));
}

// Simplified Async Hooks Example
function asyncHooksExample() {
    const hook = async_hooks.createHook({
        init(asyncId, type) {
            console.log(`Async hook started: ${type}`);
        },
        destroy(asyncId) {
            console.log(`Async hook destroyed: ${asyncId}`);
        }
    });

    hook.enable();

    // Simulate asynchronous operations
    setTimeout(() => {
        console.log('Inside setTimeout');
    }, 1000);

    Promise.resolve().then(() => {
        console.log('Inside Promise');
    });
}
// 3. Crypto Example
function cryptoExample() {
    const hash = crypto.createHash('sha256');
    hash.update('Hello, Node.js!');
    console.log('SHA-256 Hash:', hash.digest('hex'));
}

// 4. Cluster Example
function clusterExample() {
    if (cluster.isMaster) {
        console.log('Master process is running on PID:', process.pid);
        
        // Fork workers
        os.cpus().forEach(() => cluster.fork());

        http.createServer((req, res) => {
            res.writeHead(200);
            res.end('Hello from Master Process!');
        }).listen(8090, () => {
            console.log('Master process is listening on port 8090');
        });
        
        cluster.on('exit', (worker) => {
            console.log(`Worker ${worker.process.pid} died`);
        });
    } else {
        console.log('Worker process started:', process.pid);
    }
}

// 5. Process Example
function processExample() {
    console.log('Process ID:', process.pid);
    setTimeout(() => console.log('End of Process Example'), 2000);
}

// 6. Utilities Example
function utilitiesExample() {
    const formatted = util.format('Hello, %s!', 'World');
    console.log('Formatted String:', formatted);
}

// Main Execution
function main() {
    console.log('Starting the Node.js Application...');

    bufferExample();
    streamExample();
    cryptoExample();
    asyncHooksExample();
    clusterExample();
    processExample();
    utilitiesExample();
}

// Run the application
main();
