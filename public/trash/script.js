if (window.location.href !== 'http://localhost:8080/') {
    console.log('ENTRA AQUI--->');
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/.tmp',
        before: function () {
        },
        success: function (response) {
            let data = JSON.parse(response);
            //console.log('response:', data.avatar_url);
            //console.log(response);
            $("#bodyResponse").val(data);
            $('img.card-img-top').attr('src', data.avatar_url);

            $('#userName').text(data.login);
        },
        complete: function (errors) {
            console.log("completed");
        }
    });
}


/*
var w;
    if(typeof(Worker) !== "undefined") {
        if(typeof(w) == "undefined") {
            w = new Worker("workers.js");
        }
        w.onmessage = function(event) {
            document.getElementById("result").innerHTML = event.data;
        };
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Workers...";
    }
*/
// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:40210');

//Connection status
console.log('status', socket.readyState);

// Connection opened
socket.addEventListener('open', function (event) {
    $('.meta h5').html('CONNECTED');
});


let percentage = 0;
let i = 0;

// Listen for messages
let data;
socket.addEventListener('message', function (event) {
    console.log(event.data);

    try {
        data = event.data.toString().split('|');
        }catch (e) {
        console.log("error con el split");
        }

    try {
        if(data[2]!=='' && data[2].indexOf('total Acounts') !== -1){
            $('.progress').show();
            let acounts = data[2].replace('total Acounts : ', '').split(' == ');
            let test = acounts[1].split('/')[1];
            let totalTest =  acounts[0]*test;
            percentage  = 100/totalTest;
            console.log({'totalAcounts': acounts[0],  'test': test, 'totalTest':totalTest, 'percentage':percentage})
        }
        }catch (e) {

        }


    let status;

    switch (data[1]){
        case ' S ' :
            i = i+percentage;
            console.log('Success');
            status = '<i style="color:green" class="fas  fa-check fa-1x"></i>';
            $('.progress-bar').css({"width":i+'%'});
            console.log('>>>>',i);
            break;
        case ' E ':
            console.log('Error');
            status = '<i style="color:red" class="fas fa-skull fa-1x"></i>';
            break;
        case ' W ':
            console.log('Warning');
            status = '<i style="color:orange" class="fas fa-exclamation-triangle fa-1x"></i>';
            break;
        case ' I ':
            console.log('Info');
            status = '<i style="color:deepskyblue" class="fas fa-info-circle fa-1x"></i>';
            break
    }

    if(data[0] !== '[object Blob]')
    $('#logResult tbody').prepend('<tr class="success"><td class="small">' + data[0] + '</td><td align="center" class="small">' + status + '</td><td class="small"><small>' + data[2] + '</small></td></tr>');



});
$('#send').on("click",()=>{
    socket.send($('#commands').val())
});

$('#bots a').on('click', function() {
    console.log($(this).html());
    $('#tBots').html($(this).html());
    $('#commands').val('');
    $('#commands').val('execute '+$(this).html().toLowerCase());
    $('#tAcctions').html('Acction');
    $('#tTypeExecutions').html('Type of execution');
});

$('#acctions a').on('click', function() {

    $('#tAcctions').html($(this).html());
    let currentCommands = $('#commands').val();

    let action = '';
    switch ($(this).html()){
        case 'Dowload PDF &amp; 835':
            action  = 'download';
            break;
        case 'Audit payment':
            action  = 'audit';
            break;
        case 'Validate credentials':
            action  = 'validate';
            break;
    }
    $('#commands').val('');
    $('#commands').val(currentCommands.replace(/ download| audit| validate|S|M|XS|MX| --|/g, '')+' '+action);
    $('#tTypeExecutions').html('Type of execution');
});

$('#typeExecutions a').on('click', function() {
    $('#tTypeExecutions').html($(this).html());

    let currentCommands = $('#commands').val();
    let action = '';
    switch ($(this).html()){
        case 'single':
            action  = '--S';
            break;
        case 'Multiple':
            action  = '--M';
            break;
        case 'Programada (Single)':
            action  = '--XS';
            break;
        case 'Programada (Multiple)':
            action  = '--XM';
            break;
    }


    $('#commands').val('');
    $('#commands').val(currentCommands.replace(/S|M|XS|XM| --|/g, '')+' '+action);
});

$('#reset a').on('click', function() {
    $('#commands').val('');
    $('#tBots').html('Bots');
    $('#tAcctions').html('Acction');
    $('#tTypeExecutions').html('Type of execution');
});


let trueOff = "sure you want to stop all processes? \n turn off the server and you can not turn it on again";
$('#disconnect').on("click",()=>{
    if(confirm(trueOff) === true){
        //socket.send('kill_process');
        socket.close();
        $('.meta h5').html('DISCONNECTED');
    }

});

let text = "Do not do it! \n only in case of emergency";
$('#killProcess').on("click",()=>{
    if(confirm(text) === true){
        socket.send('kill_process');
        //socket.close();
        $('.meta h5').html('DECEASED');
    }

});


/*$('#killProcess').on("click", function () {
    if (confirm("sure you want to stop all processes?") === true) {
        socket.send('kill_process');
    }
});*/
/*
$('#send').on("click", function () {
    socket.send($('#commands').val());
});

*/

let parameters = "";
$(document).ready(function () {
    event.preventDefault();
    $('.progress').hide();
    $("#urlbase").keyup(function () {
        let value = $(this).val();
        $("#urlText").text(value);
    }).keyup();
    $("#1").on("click", function () {
        $("#method").val($(".method-1").text());
        $("#uri").val($("#urlbase").val() + $("#1").text());
        $("#parameters").val(parameters);
        $("#btn").removeClass("invisible")
    });
    $("#2").on("click", function () {
        $("#method").val($(".method-2").text());
        $("#uri").val(baseUrl + $("#2").text());
        $("#parameters").val(JSON.stringify(parameters));
        $("#btn").removeClass("invisible")
    });
});

/*function sendRequest() {
    let url = $("#uri").val();
    let method = $("#method").val();
    let param = JSON.parse($("#parameters").val());
    if (confirm("Seguro que deseas enviar?") == true) {

        let _url = ($('#connect').is(':checked') ? url : 'curl.php');

        $.ajax({
            type: method,
            url: _url,
            data: param,
            before: function () {
            },
            success: function (response) {
                $("#bodyResponse").val(JSON.stringify(response));
            },
            complete: function (errors) {
                alert("completed");
            }
        });
    }*/

// }      