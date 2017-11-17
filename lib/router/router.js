Router.configure({
  layoutTemplate: 'layout',
  waitOn: function() { return Meteor.subscribe("flightData"); },
  loadingTemplate: 'loading'
});

Router.route('/', {
  name: 'AddFlightData'
});

Router.route('/flight/:_id', {
  name: 'UpdateFlightData',
  data: function() { return FlightData.findOne(this.params._id); }
});
