// YOUR CODE HERE:
$(document).ready(function() {

  var contentDiv = $(".messages");
  var lastMessageTime = new Date("2000-01-21T00:12:59.906Z");
  var username = window.location.search.slice(10);
  var currentRoom = "heeeeeeeeeeelp";
  var rooms = {};
  var $roomsAvail = $('.roomsAvail');


  var makeMessage = function() {
    var message = {};
    message.username = username;
    message.text = $(".messagebox").val();
    message.room = currentRoom;
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


  var getMessages = function() {
    var promise = $.Deferred();
    $.ajax({
      url: "https://api.parse.com/1/classes/chatterbox",
      dataType:'json',
      contentType:'application/json',
      data: {'order':'-createdAt'},
      success: function(data) {
        promise.resolve(data.results);
      }
    });
    return promise;
  };

  var storeRooms = function(message) {
    if(message.room && !(rooms[message.room])) {
      rooms[message.room] = message.room;
      addRoomsToList(message.room);
      console.log(message.room);
    }
  };

  var addRoomsToList = function(room) {
    var $option = $("<option></option>");
    $option.attr("value", room);
    $option.text(room);
    $roomsAvail.append($option);
  };

  var fetch = function(fn) {
    var messagesPromise = getMessages();
    messagesPromise.done(function(messages) {
      $.each(messages, function(index, message) {
        if(new Date(message.createdAt) > lastMessageTime) {
          fn(message);
          lastMessageTime = new Date(message.createdAt);
          storeRooms(message);
        }
      });
    });
  };

  var firstFetch = function(fn) {
    var messagesPromise = getMessages();
    messagesPromise.done(function(messages) {
      $.each(messages, function(index, message) {
        fn(message);
        storeRooms(message);
      });
    });
  };

  var display = function(message) {
    var messageDiv = $("<div></div>").text(message.username + ' said ' + message.text +
                                            ', created at: ' + new Date(message.createdAt) + ' from room: ' + message.room);
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

  $(".roomsAvail").on("change", function() {
    console.log("change happened... " + $(this) + "changed");

  });

  firstFetch(display);
  refresh();

});
  // var fetch = function(fn) {
  //   $.ajax({
  //     url: "https://api.parse.com/1/classes/chatterbox",
  //     dataType:'json',
  //     contentType:'application/json',
  //     data: {'order':'-createdAt'},
  //     success: function(data) {
  //       var messages = data.results;
  //       $.each(messages, function(index, message) {
  //         if(new Date(message.createdAt) > lastMessageTime) {
  //           fn(message);
  //           lastMessageTime = new Date(message.createdAt);
  //         }
  //       });

  //     },
  //     error: function(error) {
  //       console.log("Error: " + error.message);
  //     }
  //   });
  // };