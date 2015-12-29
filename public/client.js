// script.js = côté client
$('.print').click(function() {
$("#texte").removeClass( );
$("li").removeClass( );

  $('li').css('left', Math.random() * 150 );
  $('li').css('top', Math.random() * 150 );
  $('img').css('position','absolute','left', Math.random() * 150 ,'width','50px','height','100%');
  $('img').css('position','absolute','top', Math.random() * 150 ,'width','50 px','height','100%');

});


$(document).ready(function(){

    $('#user').focus();
    window.scrollTo(0,0);

    var printHeight = $('#tchat').height();
    var printWidth = $('#tchat').width();
    console.log(printHeight, printHeight)

    /// socket qui permet le chat à installer avat, style bibliothèque (django...)
	var socket = io();
    $( "#entrer" ).click(function() {
        $( "#fond" ).css("visibility", "hidden");
        $( "#champ" ).css("visibility", "visible");
        $( "#tchat" ).css("visibility", "visible");
        $("body").css("background-color","#f8f8f8");

    });
    $('body').keyup(function(e){
       if(e.keyCode ==  13 ){
           $( "body" ).css("overflow", "visible");
           $( "#fond" ).css("visibility", "hidden");
           $( "#champ" ).css("visibility", "visible");
           $( "#tchat" ).css("visibility", "visible");
           $("body").css("background-color","#f8f8f8");
           $('#m').focus();
           $('#m').val('');

       }
   });


	socket.on('chat message', function(msg,user){ // il reçoit le message

// --------------------- Random position User --------------------------- //

		translate(msg, user); // & traduit le message dans la langue désirée
        console.log(user);
	});

    socket.on('displayNewImage', function(msg){ // il reçoit le message
		console.log(msg); // & traduit le message dans la langue désirée
        var $img = $('<img src=' + msg +'>');
        $('#messages').append( $img );

// --------------------- Random position image --------------------------- //
        var imgHeight = $img.height();
        var imgWidth = $img.width();
        var topImg = Math.round(Math.random() * printHeight-imgHeight);
        var leftImg = Math.round(Math.random() * printWidth-imgWidth);
        $('#tchat').find($img).css({"top":topImg+'px', "left":leftImg+'px'});
	});

    // La traduction
        // lien vers le code qui permet d'accéder à l'API
    var apikey = "trnsl.1.1.20151215T151118Z.9940f7b3aa55db27.3e011c9b176df1db3379328cdbe13eb98dd73de9";
        // sélectionne la langue désirée pour la réception
    var lang = $('#languages').val();

        // Ecoute si l'on change la langue & l'affiche dans la console
    $('#languages').on('change', function(){
        lang = $('#languages').val();
        console.log('translating in ' + lang)
    })

// ------------- Fonction qui traduit le message ---------------- //
    translate = function(msg, user){
        $.ajax({
            type: 'GET',
            url: "https://translate.yandex.net/api/v1.5/tr.json/translate?key="+apikey+"&text=" + msg + "&lang=" + lang,

            dataType: 'jsonp',
            crossDomain: true,

            success: function (data) {

                var texte = data.text[0];
                var $li = $('<li class = "message" ><span class = "user">'  + user + ' ( '+lang +')' + '</span><span class="text">' + texte + '</span></li>');

                //$("#print .message").css({"top":top, "left":left});
                console.log(top);
                $('#messages').append( $li );

// --------------------- Random position message --------------------------- //

                $li.css('position','absolute');
                var liHeight = $li.height();
                var liWidth = $li.width();
                $li.css('position','static');
                var topMsg = Math.round(Math.random() * printHeight-liHeight);
                var leftMsg = Math.round(Math.random() * printWidth-liWidth);
                $('#tchat').find($li).css({"top": topMsg +'px', "left": leftMsg +'px'});

            },
            error: function() { alert('Failed!'); }, // S'il y a un problème, un pop up nous en avertie
        });
    }



    // ------------------------- images ------------------------- //
    var imageData = null;

    $("#localfile").bind('change', function(e){
    	//upload(e.originalEvent.target.files);
    	imageData = e.originalEvent.target.files;
    	//change the label of the button in the name of the image
    	fileName = this.files[0].name;
      var dflt = $(this).attr("placeholder");
      if($(this).val()!=""){
        $(this).next().text(fileName);
      } else {
        $(this).next().text(dflt);
      }
    });


    $('#addimage').on('submit', function(e){
        e.preventDefault();
        var message = $('#m').val();
        var user = $('#user').val();

    	if(imageData != null){
    		console.log('Une image a été ajoutée');
    		var f = imageData[0];
    		var reader = new FileReader();
    		reader.onload = function(evt){
    			socket.emit("chat image", {message:message,file:evt.target.result, fileName:fileName});
                imageData = null;
    		};
    		reader.readAsDataURL(f);
            socket.emit('chat message', message, user);
    	} else {
            // récupère la valeur de l'input donc (le texte) & l'envoi au serveur
            socket.emit('chat message', message, user);
        }
    });
});
