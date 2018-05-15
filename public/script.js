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

// Listen for messages
let data;
socket.addEventListener('message', function (event) {
    console.log(event.data);




    let data = event.data.split('|');
    let status;
    switch (data[1]){
        case ' S ' :
            console.log('Success');
            status = '<i  style="color:green" class="fas  fa-check fa-1x"></i>';
            break;
        case ' E ':
            console.log('Error');
            status = '<i  style="color:orange" class="fas fa-exclamation-triangle"></i>';
            break;
        case ' W ':
            console.log('Warning');
            status = '<i  style="color:orange" class="fas fa-exclamation-triangle"></i>';
            break;
        case ' I ':
            console.log('Info');
            status = '<i  style="color:deepskyblue" class="fas fa-info-circle fa-1x"></i>';
            break

    }

    $('#logResult tbody').prepend('<tr class="success"><td class="small">' + data[0] + '</td><td align="center" class="small">' + status + '</td><td class="small"><small>' + data[2] + '</small></td></tr>');

});
$('#send').on("click", function () {
    socket.send($('#commands').val());
});

let parameters = "";
$(document).ready(function () {

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
});
$(document).ready(function () {
    $("#2").on("click", function () {
        $("#method").val($(".method-2").text());
        $("#uri").val(baseUrl + $("#2").text());
        $("#parameters").val(JSON.stringify(parameters));
        $("#btn").removeClass("invisible")
    });
});

function sendRequest() {
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
    }

}