// YOUR CODE HERE:
$(document).ready(function() {

  var contentDiv = $(".messages");
  var lastMessageTime = new Date("2000-01-21T00:12:59.906Z");
  var username = window.location.search.slice(10);
  console.log(username);

  var makeMessage = function() {
    var message = {};
    message.username = username;
    message.text = $(".messagebox").val();
    message.room = 'test';
    return message;
  };

  var send = function(message) {
    $.ajax({
      url:"https://api.parse.com/1/classes/chatterbox",
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(message),
      success: function() {
        console.log("Message sent!");
      },
      error: function(error) {
        console.log("Error with message: " + error.message);
      }
    });

  };


  var fetch = function(fn) {
    $.ajax({
      url: "https://api.parse.com/1/classes/chatterbox",
      dataType:'json',
      contentType:'application/json',
      data: {'order':'-createdAt'},
      success: function(data) {
        var messages = data.results;
        $.each(messages, function(index, message) {
          if(new Date(message.createdAt) > lastMessageTime) {
            fn(message);
            lastMessageTime = new Date(message.createdAt);
          }
        });

      },
      error: function(error) {
        console.log("Error: " + error.message);
      }
    });
  };

  var display = function(message) {
    var messageDiv = $("<div></div>").text(message.username + ' said ' + message.text +
                                            ', created at: ' + new Date(message.createdAt));
    contentDiv.prepend(messageDiv);
  };

  var refresh = function() {
    setInterval(function() {
      fetch(display);
    }, 2000);
  };

  $(".submitButton").on("click", function() {
    send(makeMessage());
    $('.messagebox').val("");
  });

  refresh();

});