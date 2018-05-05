let parameters = "{\n" +
    "  \"login\": \"PRM7100\",\n" +
    "  \"password\": \"L@nd1326\",\n" +
    "  \"botName\": \"Medicare_spot\",\n" +
    "  \"parameters\": [\n" +
    "    {\n" +
    "      \"practiceName\": \"CFBack\",\n" +
    "      \"memberId\": \"514423000A\",\n" +
    "      \"dos\": \"11\/16\/2017\"\n" +
    "    },\n" +
    "    {\n" +
    "      \"practiceName\": \"CFBack\",\n" +
    "      \"memberId\": \"475480940A\",\n" +
    "      \"dos\": \"01\/18\/2018\"\n" +
    "    }\n" +
    "  ]\n" +
    "}";

    $(document).ready(function () {

    $("#urlbase").keyup(function () {
        let value = $(this).val();
        $("#urlText").text(value);
    }).keyup();


    $("#1").on("click", function () {
        $("#method").val($(".method-1").text());
        $("#uri").val($("#urlbase").val()+$("#1").text());
        $("#parameters").val(parameters);
        $("#btn").removeClass("invisible")
    });
});
$(document).ready(function () {
    $("#2").on("click", function () {
        $("#method").val($(".method-2").text());
        $("#uri").val(baseUrl+$("#2").text());
        $("#parameters").val(JSON.stringify(parameters));
        $("#btn").removeClass("invisible")
    });
});

function sendRequest() {
    let url = $("#uri").val();
    let method = $("#method").val();
    let param =  JSON.parse($("#parameters").val());
    if (confirm("Seguro que deseas enviar?") == true) {

        let _url =  ($('#connect').is(':checked')?url:'curl.php');

        $.ajax({
            type: method,
            url: _url,
            data:param,
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