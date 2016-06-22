Todos = new Mongo.Collection('todos');

if (Meteor.isClient) {
// subscribe
  Meteor.subscribe('todos');

  Template.main.helpers({
    todos: function(){
      return Todos.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.main.events({
    "submit .new-todo": function(event){
      var text = event.target.text.value;
      Meteor.call('addTodo', text, Meteor.userId(), Meteor.user().username);
      event.target.text.value = "";
      return false;
    },
    "click .toggle-check": function(event){
      Meteor.call('setChecked', this._id, !this.checked);
    },
    "click .delete-todo": function(){
      if(confirm('Are you sure?')){
        Meteor.call("deleteTodos", this._id)
      }
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL",
  });


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.publish('todos', function(){
    if(!this.userId){
      return Todos.find();
    }else{
      return Todos.find({userId: this.userId});
    }
  })
}

Meteor.methods({
  addTodo: function(text, userId, username){
    if(!Meteor.userId()){
      throw new Meteor.Error('not authorized');
    }
    Todos.insert({
      text: text,
      createdAt: new Date(),
      userId: userId,
      username: username
    });
  },
  deleteTodos: function(id){
    var todo = Todos.findOne(id);
    if(todo.userId !== Meteor.userId()){
      throw new Meteor.Error('not authorized');
    }
    Todos.remove(id);
  },
  setChecked: function(id, setCheck){
    var todo = Todos. findOne(id);
    if(todo.userId !== Meteor.userId()){
      throw new Meteor.Error('not authorized');
    }
    Todos.update(id, {$set: {checked: setCheck}})
  }
});
