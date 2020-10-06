$(document).on('ready',function(){
    $.getJSON('usuarios.json', function(data) {
        $.each(data, function(key, value) {
            $("#usuarios").append('<option name="' + key + '">' + value + '</option>');
        }); // close each()
    }); // close getJSON()
});