var app = app ||{};

app.MemberSingleModel = Backbone.Model.extend({
    parse: function(data){
        return data;    
    }
});


/**
 * Retrieve and parse the MP data
 */
app.MemberListCollection = Backbone.Collection.extend({
    model: app.MemberSingleModel,
    url: 'https://represent.opennorth.ca/representatives/house-of-commons/?limit=400',
    type: 'GET',
    parse: function (response) {
        //Where we define how the data looks - models will be mpty unless you return this value
       return response.objects;
    },
     comparator: function(item) { 
        return item.get('last_name').toLowerCase(); 
    }
});

/**
 * Set up the template for individual MP
 */
app.MemberSingleView = Backbone.View.extend({
    el: '.data_row',
    tagName: 'div',
    template: _.template($('#data_template').html()),
    initialize: function(){
        this.render();
    },
    // Push the model data into the template
    render: function(){
        this.$el.append(this.template(this.model.attributes));
        return this;
    }
});

/**
 * Set up the list view
 */
app.MemberListView = Backbone.View.extend({
    el: '.data_container',
    initialize: function(){
        this.collection.fetch({
            success: this.fetchSuccess,
            error: this.fetchError
        });
    },
    // 
    events: {
        "change #party-filter" : "requestedParty",
        "click #export-csv"    : "exportData"
    },

    // Loops through data and creates the individual MP listings
    fetchSuccess: function (collection, response, rawData) {
        //loop through returned collection
        collection.each(function(model){
            //generate a single member view for each
            memberSingleView = new app.MemberSingleView({model:model});
        });
        return this;
    },

    // Exports the filtered data to a CSV
    exportData : function(response){
       
        var e = document.getElementById('party-filter');
        var partySelected = e.options[e.selectedIndex].value;
    
        if(partySelected != 'Reset'){
            filteredPartyData = this.collection.where({party_name: partySelected});        
        } else {
            filteredPartyData = this.collection.models;
        }
        
        var mpArray = Array();

        filteredPartyData.forEach(function(newArray, index){       
            mpArray[index] = [
                newArray.attributes.party_name,
                newArray.attributes.district_name,
                newArray.attributes.name,
                newArray.attributes.email,
            ];

        });

        var csvContent = "data:text/csv;charset=utf-8," + "\n";
        var headerRow = ["Party", "Riding", "Name", "Email"] + "\n";
        csvContent += headerRow;
        
        mpArray.forEach(function (infoArraySecondary, index) {
            dataString = infoArraySecondary.join(",");
            csvContent += index < mpArray.length ? dataString + "\n" : dataString;

        });
        
        var encodedUri = encodeURI(csvContent);
        
        window.open(encodedUri);
    },
    
    // Filter the visible MPs by party
    requestedParty: function(){
        this.$el.find('.data_row').empty();
        var filteredPartyData;
        var partyFilter = this.$el.find('#party-filter');
        var partySelected = partyFilter.val();

        if (partySelected === 'Reset'){
            filteredPartyData = this.collection.models;
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
    // If there's an error on fetching, return it
    fetchError: function (collection, response) {
        throw new Error("error");
    },
    render: function(){
        return this;
    },
});

var memberSingleModel = new app.MemberSingleModel();
var memberListCollection = new app.MemberListCollection();
var memberListView = new app.MemberListView({model: memberSingleModel, collection: memberListCollection});

