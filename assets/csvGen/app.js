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
       console.log(response);
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
        var userRiding ='boom';
    },
    events: {
        "change #party-filter" : "requestedParty",
        "focus #riding-filter" : "ridingAutocomplete",
        "click #riding-submit" : "requestedRiding",


    },
    fetchSuccess: function (collection, response) {

        //loop through returned collection
        collection.each(function(model){
            //generate a single member view for each
            memberSingleView = new app.MemberSingleView({model:model});
        });
        return this;
    },
    requestedParty: function(){
        this.$el.find('.data_row').empty();
        var filteredPartyData;
        var partyFilter = this.$el.find('#party-filter');
        var partySelected = partyFilter.val();

        if (partySelected === 'Reset'){
            //console.log('reset'); 
            filteredPartyData = this.collection.models;
            //console.log(filteredPartyData);
        } else {

            filteredPartyData = this.collection.where({party_name: partySelected});
        }
       
        filteredList = new app.MemberListCollection(filteredPartyData);
        filteredList.each(function(model){
            //generate a single member view for each
            memberSingleView = new app.MemberSingleView({model:model});
        });
        return this;
       
    }, 

    requestedRiding: function(){
        //Run the selected riding through the collection to get a match

        //If the data-riding attr is set...
        if($('#riding-filter').is('[data-riding]')){
            //Clear old data
            this.$el.find('.data_row').empty();
            var userRiding = $('#riding-filter').attr('data-riding');
            //Filter for the desired riding
            filteredRidingData = this.collection.where({district_name : userRiding});
            filteredRidingList = new app.MemberListCollection(filteredRidingData);
            filteredRidingList.each(function(model){
            //generate a single member view for each
            memberSingleView = new app.MemberSingleView({model:model});
        });
        return this;
        };
    },
           
   ridingAutocomplete: function(userRiding){     
        var ridings = new Array;
        //create an array of ridings, so we can populate the autocomplete
        $.each(this.collection.models, function(key, index){
            ridings[key] = index.get('district_name');
            console.log(index.get('district_name'));
        });
        //render the autocomplete
        $( "#riding-filter" ).autocomplete({
           source: ridings,
        });
        $( "#riding-filter" ).on( "autocompleteselect", function( event, ui) {
            userRiding = ui.item.value;
            //append selected value to field as a data-attribute
            $('#riding-filter').attr('data-riding', userRiding);
        } );
    },


    fetchError: function (collection, response) {
        throw new Error("error");
    },
    render: function(){
        return this;
    },
    addMember: function(member){
        
        this.$el.append(memberSingleView.render().el);
    }
});


var memberSingleModel = new app.MemberSingleModel();
var memberListCollection = new app.MemberListCollection();
var memberListView = new app.MemberListView({model: memberSingleModel, collection: memberListCollection});

