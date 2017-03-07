var app = app || {};


app.MemberSingleView = Backbone.View.extend({

    el: '#search_container',

    template: _.template($('#search_template').html()),

 initialize: function (options) {
        this.render();
    },

 
  render: function(model){

    // this.$el.html('sally');
     this.$el.append(this.template(this.model.attributes));
     console.log('model');
    return this;
   // this.$el.html( this.template(this.model.toJSON()));
   // console.log(custom_template);

   // return this;
   // console.log(this);

  }

});





app.MemberListView = Backbone.View.extend({
   
   tagName: 'ul',

    initialize: function(){
         this.listenTo(this.collection, 'reset', this.handleReset);
    },

    render: function(){
         this.$el.html('');

          memberListCollection.each(function(model) {
            var singleMember = new app.MemberSingleView({
              model: model
            });

            this.$el.append(singleMember.render().el);
          }.bind(this));

          return this;
    },

    handleSuccess: function (options) {

        console.log('handledsuccess');
        // options will be any options you passed when triggering the custom event
    },

    handleError: function (options) {
        console.log('handlederror');
        // options will be any options you passed when triggering the custom event
    }
   
});


