
//console.log('This is app.js');
var app = app ||{};


app.MemberSingleModel = Backbone.Model.extend({
    parse: function(data){
        return data;    
    }
});

app.MemberListCollection = Backbone.Collection.extend({
    model: app.MemberSingleModel,
    url: 'https://represent.opennorth.ca/representatives/house-of-commons/?limit=400',
    type: 'GET',
    parse: function (response) {
        //Where i define how the data looks - models will be mpty unless you return this value
       return response.objects;
    },
});



app.MemberSingleView = Backbone.View.extend({
    el: '#search_container',
    tagName: 'div',
    template: _.template($('#search_template').html()),
    initialize: function(){
        this.render();

    },
    render: function(){
        //console.log(this.model);
        this.$el.append(this.template(this.model.attributes));
        return this;
    }
});


app.MemberListView = Backbone.View.extend({
    el: '.search_container',
    tagName: 'div',
    initialize: function(){
        this.collection.fetch({
            success: this.fetchSuccess,
            error: this.fetchError

        });
    },
    fetchSuccess: function (collection, response) {
       
        console.log('Collection fetch success', response);
        console.log('Collection models: ', collection.models);
        //loop through returned collection
        collection.each(function(model){
            //generate a single member view for each
            memberSingleView = new app.MemberSingleView({model:model});
            console.log(model); 
        });
        return this;

    },

    fetchError: function (collection, response) {
        throw new Error("error");
    },
    render: function(){
        
       // console.log(this.collection);
        return this;
    },
    addMember: function(member){
        
        this.$el.append(memberSingleView.render().el);
    }
});


var memberSingleModel = new app.MemberSingleModel();
var memberListCollection = new app.MemberListCollection();
var memberListView = new app.MemberListView({model: memberSingleModel, collection: memberListCollection});

//memberSingleView = new app.MemberSingleView({model:memberSingleModel});





$('#mpname').html(memberListView.render().el);


//call view
//view references collection
//view only loads after data is returned






















/*
var memberSingleModel = new app.MemberSingleModel();

var memberSingleView = new app.MemberSingleView({model: memberSingleModel});

//
var memberListCollection = new app.MemberListCollection({model: memberSingleModel});

var memberListView = new app.MemberListView({collection: memberListCollection});

memberListCollection.fetch();
console.log(app);

//By the time this executes, everything has loaded and collection looks empty
memberListCollection.fetch().done(function(){
//console.log(memberListCollection);

    memberListView.render();

});

memberListCollection.reset();
*/

//console.log(app);
/*

//Create Model

var csvSingleMPModel = new app.CsvSingleMPModel();
//Create Collection
var csvListCollection = new app.CsvListCollection([
  // bootstrap with all of the models for all of the pages here
], {
  mode: "client"
});

csvSingleMPView = new app.CsvSingleMPView({model: csvSingleMPModel});
csvSingleMPView.render();
//Pass Model data to collection
csvListCollection.reset(csvSingleMPModel);
   
 console.log(app);
*/
//app.router = new app.Router();
//Backbone.history.start();

