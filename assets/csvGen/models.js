var app = app || {};

app.MemberSingleModel = Backbone.Model.extend({
    default: {
        name: 'MP Name'
    },
    initialize: function(){
        //console.log(this);
    },
    render: function(){
        return this;
    }
});



