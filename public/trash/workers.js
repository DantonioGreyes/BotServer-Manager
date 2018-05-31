/*
if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
} else {
    alert('The File APIs are not fully supported in this browser.');
}

let header;
const stream = fs.createReadStream('G:\\Sistemas\\BotServer-Manager\\logs\\log_tmp.log', {encoding: 'utf8'});
stream.on('data', data => {
    header = data.split(/~/g)[0];
    stream.destroy();
});


var i = 0;

function timedCount() {
    i = header;
    postMessage(i);
    setTimeout("timedCount()",500);
}

timedCount();
*/