
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

     comparator: function(item) { 
        return item.get('last_name').toLowerCase(); 
    }
});



app.MemberSingleView = Backbone.View.extend({
    el: '.data_row',
    tagName: 'div',
    template: _.template($('#data_template').html()),
    initialize: function(){
        this.render();
       // console.log(this.$el.find('#party-filter'));

    },


    render: function(){
        //console.log(this.model);
        this.$el.append(this.template(this.model.attributes));
        return this;
    }
});


app.MemberListView = Backbone.View.extend({
    el: '.data_container',
    initialize: function(){
        this.collection.fetch({
            success: this.fetchSuccess,
            error: this.fetchError
        });
        
        
    },

    events: {
        "change #party-filter" : "requestedParty"
    },
    fetchSuccess: function (collection, response) {

        //loop through returned collection
        collection.each(function(model){
            //generate a single member view for each
            memberSingleView = new app.MemberSingleView({model:model});
          //  console.log(model); 
        });

        return this;

        console.log('logged');
       

    },
/*
    getParties: function () {
      //  console.log(this.collection.pluck("party_name"));
        return _.uniq(this.collection.pluck("party_name"), false, function (type) {
            return type.toLowerCase();
            console.log(type.toLowerCase());
        });
    },
    createSelect: function () {
      //  console.log(this.getParties);
       // var filter = this.el.find("#party-filter"),
        
            select = $("<select/>", {
                html: "<option>All</option>"
            });
            console.log(filter);
     
        _.each(this.getParties(), function (item) {
            console.log(item);
            var option = $("<option/>", {
                value: item.toLowerCase(),
                text: item.toLowerCase()
            }).appendTo(filter);
        });
        return filter;
    },*/
    requestedParty: function(){
        this.$el.find('.data_row').empty();
        var filteredPartyData;
        var filter = this.$el.find('#party-filter');
        var partySelected = filter.val();

        if (partySelected === 'Reset'){
            console.log('reset'); 
            filteredPartyData = this.collection.models;
            console.log(filteredPartyData);
        } else {

            filteredPartyData = this.collection.where({party_name: partySelected});
        }
       // filteredView = this.collection.reset(filteredPartyData);
       
        filteredList = new app.MemberListCollection(filteredPartyData);
        filteredList.each(function(model){

            //generate a single member view for each
            memberSingleView = new app.MemberSingleView({model:model});
          //  console.log(model); 
        });
      //  this.$el.append(filteredView.render().el);
        
//console.log(filteredPartyData);

        return this;
        

       
    }, 

    requestedRiding: function(){
        
    },
    fetchError: function (collection, response) {
        throw new Error("error");
    },
    render: function(){
        //var filter = this.$el.find('#party-filter');
        //filter.createSelect;
        //console.log(this.$el.find('#party-filter'));
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




$('#riding-filter').keypress( function () {
    var year = $("#riding-filter").val();
    console.log(year);
    //look at current collection
    //find whatever is in the field
}).change();

















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

