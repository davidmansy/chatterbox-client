//MODEL CLASS
//***********

//Message model CLASS
var Message = Backbone.Model.extend({
  tagName: 'div',
  className: 'message'
});

//Message collection CLASS
var MessageList = Backbone.Collection.extend({
  model: Message,
  url: "https://api.parse.com/1/classes/chatterbox",
  dataType:'json',
  parse: function(response) {
    return response.results;
  },
  contentType:'application/json',
  data: {'order':'-createdAt'}
});
//************

//VIEW CLASS
//***********
//Message view CLASS
var MessageView = Backbone.View.extend({

  template: _.template('<div><%= username %> said: <%= text %></div>'),

  render: function() {
    var attributes = this.model.toJSON();
    console.log("MessageView");
    console.log(attributes);
    console.log(this.$el);
    console.log(this.template(attributes));
    this.$el.html(this.template(attributes));
    console.log(this.$el.html());
  }

});

//Message collection view CLASS
var MessageListView = Backbone.View.extend({

  render: function() {
    this.collection.forEach(this.addOne, this);
  },
  addOne: function(message) {
    var messageView = new MessageView({model: message});
    console.log('messageViewList');
    console.log(messageView);
    console.log("please");
    console.log(messageView.render().el);
    this.$el.append(messageView.render().el);
  }
});
//************

//Launch the chain
var messageList = new MessageList(); //Instantiate message collection
messageList.fetch({
  success: function(data) {
    console.log('success');
    console.log(data);
    var messageListView = new MessageListView({collection: messageList}); //Instantiate a message collection view object
    messageListView.render();
    console.log(messageListView.el);
  },
  error: function() {
    console.log('did not work');
  }
});


// var createMessage = function(messageData) {
//   //Model
//   var message = new Message(messageData);
//   messageList.add(message);
//   //View

// };

// app.firstFetch(createMessage);
// console.log(messageList);
// console.log(messageListView);


//View


// var Message = Backbone.model.extend({
//   initialize: function(messageData);
//   },
// })

// var message = new Message(messageData);