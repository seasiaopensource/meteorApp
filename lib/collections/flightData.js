
flightData = "flightData";  // avoid typos, this string occurs many times.

FlightData = new Mongo.Collection(flightData);

if (Meteor.isServer) {
    // Listen to incoming HTTP requests, can only be used on the server
    WebApp.rawConnectHandlers.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        return next();
    });
    Meteor.publish(flightData, function () {
        console.log('go1',FlightData.find({}));
        return FlightData.find();
    });
}

Meteor.methods({
  /**
   * Invoked by autoform to add a new Student Data record.
   * @param doc The FlightData document.
   */
  addFlightData: function(doc) {

      HTTP.get('https://api.flightstats.com/flex/schedules/rest/v1/json/flight/AA/'+doc.flightNumber+'/departing/'+ moment(doc.date).format('YYYY/MM/DD')+'?appId=5ec701f5&appKey=3bdbf1102530fd93c44fb7ae5b49baa5',
          function (error, result) {
            if(!error){
                doc.result = result.content;
                //check(doc, FlightData.simpleSchema());
                FlightData.insert(doc, function(err, docID) {console.log("DocID: ", docID);});
          }
          });

  },
    /**
     * Get Flight data
     * @returns {any}
     */
    getFightData:function (date, flight_no) {
        this.unblock(); //
        var data = HTTP.get('https://api.flightstats.com/flex/schedules/rest/v1/json/flight/AA/'+flight_no+'/departing/'+ date +'?appId=5ec701f5&appKey=3bdbf1102530fd93c44fb7ae5b49baa5');
        return data;

    }
});

// Publish the entire Collection.  Subscription performed in the router.



/**
 * Create the schema for Flight Data.
 */
FlightData.attachSchema(new SimpleSchema({
  flightNumber: {
    label: "Flight Number",
    type: String,
    optional: false,
    min:3,
    max: 6,
    autoform: {
      group: flightData,
      placeholder: "Flight Number"
    }
  },
  date: {
        label: "date",
        type: Date,
        optional: false,
        autoform: {
            group: flightData,
            placeholder: 'Flight Date'
        }
    },
    result: {
        type:  String,
        optional: true,
        autoform: {
            type: "hidden",
            group: flightData,
            label: false
        }

    },



}));
if (Meteor.isClient) {

    Template.AddFlightData.onCreated(function helloOnCreated() {
        //Meteor.subscribe(flightData);
        // counter starts at 0
        this.result = {};
    });
    Template.AddFlightData.events({
        'submit #AddFlightDataForm' : function(event){
                var flight_number = event.target.flightNumber.value;
                var date = moment(event.target.date.value).format('YYYY/MM/DD');
                Meteor.call('getFightData',date, flight_number,function(error, result){
                    Session.set('ress',result);
                    return console.log('result2 ', result);
            });
        }
    });
    Template.AddFlightData.helpers({
        result: function () {
            return    Session.get('ress').content;
        }
    });

}