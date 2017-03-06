var app = app || {};

app.MemberListCollection = Backbone.Collection.extend({
    model: app.MemberSingleModel,
    url: 'https://represent.opennorth.ca/representatives/house-of-commons/?limit=400',
    parse: function(data) {
        console.log(data);
       
  },
  success: function(){
    console.log('success');
  },    
  error: function(){
    console.log('error');
  }
});







