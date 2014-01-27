// YOUR CODE HERE:
$(document).ready(function() {

  var contentDiv = $(".messages");
  var lastMessageTime = new Date("2000-01-21T00:12:59.906Z");
  var username = window.location.search.slice(10);
  var currentRoom = "heeeeeeeeeeelp";
  var rooms = {};
  var users = {};
  var $roomsAvail = $('.roomsAvail');

  //Utility function to create a message
  var makeMessage = function() {
    var message = {};
    message.username = username;
    message.text = $(".messagebox").val();
    message.roomname = currentRoom;
    return message;
  };

  //SENDING A MESSAGE
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

  //RETRIEVING MESSAGES
  //Core ajax call using promise
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

  //At start of the app, fetch all messages and display them
  //IN addition, store all rooms and users
  var firstFetch = function(fn) {
    var messagesPromise = getMessages();
    messagesPromise.done(function(messages) {
      $.each(messages, function(index, message) {
        fn(message);
        storeRooms(message);
        storeUsers(message);
      });
    });
  };

  //Following refresh call this function that get all messages and check if there are new ones
  //For each new one, we store room and users
  var fetch = function(fn) {
    var messagesPromise = getMessages();
    messagesPromise.done(function(messages) {
      $.each(messages, function(index, message) {
        if(new Date(message.createdAt) > lastMessageTime) {
          fn(message);
          lastMessageTime = new Date(message.createdAt);
          storeRooms(message);
          storeUsers(message);
        }
      });
    });
  };

  var refresh = function() {
    setInterval(function() {
      fetch(display);
    }, 2000);
  };

  //ROOMS
  //Store new rooms
  var storeRooms = function(message) {
    if(message.roomname && !(rooms[message.roomname])) {
      if(message.roomname.length > 15) {
        message.roomname = message.roomname.slice(0,15) + "...";
      }
      rooms[message.roomname] = message.roomname;
      addRoomsToList(message.roomname);
      console.log(message.room);
    }
  };

  //Display a room in the list
  var addRoomsToList = function(room) {
    var $option = $("<option></option>");
    $option.attr("value", room);
    $option.text(room);
    $roomsAvail.append($option);
  };

  //USERS
  //Store new users
  var storeUsers = function(message) {
    if(message.username && !(users[message.username])) {
      if(message.username.length > 15) {
        message.username = message.username.slice(0,15) + "...";
      }
      users[message.username] = {};
      users[message.username]['friend'] = false;
      addUsersToList(message.username);
      console.log(users[message.username]);
    }
  };

  //Display a user in the list
  var addUsersToList = function(name) {
    var $label = $("<label></label>");
    var $checkbox = $("<input type='checkbox' name='users'/>");
    $checkbox.attr("value", name);
    $label.append($checkbox);
    $label.append(name);
    $(".users").append($label);
    $(".users").append("<br>");
  };

  //Update the user friend status
  var switchFriend = function(name) {
    console.log(users[name]);
    console.log(users[name].friend);
    if(users[name].friend === true) {
      users[name].friend = false;
    }else {
      users[name].friend = true;
    }
    console.log(users[name].friend);
  };


  //DISPLAY DATA
  //Update the messages style when a user is checked as friend
  var updateExistingMessages = function() {
    $(".message").each(function(index) {
      console.log($(this).attr("name"));
      var name = $(this).attr("name");
      if(users[name] && users[name].friend === true) {
        $(this).addClass("messageBold");
      }
      if(users[name] && users[name].friend === false) {
        $(this).removeClass("messageBold");
      }
    });
  };

  //Display a message at the top of the list
  var display = function(message) {
    var $messageDiv = $("<div></div>");
    $messageDiv.attr("name", message.username);
    $messageDiv.addClass("message", message.username);
    $messageDiv.text(message.username + ' said ' + message.text);
    if(users[message.username] && users[message.username].friend === true) {
      $messageDiv.addClass("messageBold");
    } else {
      $messageDiv.removeClass("messageBold");
    }
    contentDiv.prepend($messageDiv);
  };

  //HANDLING EVENTS ON THE PAGE
  //Create a message
  $(".submitButton").on("click", function() {
    send(makeMessage());
    $('.messagebox').val("");
  });

  //Update the current room - working in progress
  $(".roomsAvail").on("change", function() {
    console.log("change happened... " + $( ".roomsAvail option:selected" ).val() + " changed");
  });

  //If a friend is checked, launch the updateExistingMessages function
  $(".users").on("change", "input", function() {
    console.log("change happened...");
    console.log($(this).attr("value"));
    switchFriend($(this).attr("value"));
    updateExistingMessages();

  });

  //MAIN PROGRAM
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

