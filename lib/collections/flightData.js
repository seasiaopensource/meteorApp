
flightData = "flightData";  // avoid typos, this string occurs many times.

FlightData = new Mongo.Collection(flightData);

if (Meteor.isServer) {
    Meteor.publish(flightData, function () {
        console.log('go1',FlightData.find({}));
        return FlightData.find();
    });
}

Meteor.methods({
  /**
   * Invoked by autoform to add a new Student Data record.
   * @param doc The StudentData document.
   */
  addFlightData: function(doc) {

      HTTP.get('https://api.flightstats.com/flex/schedules/rest/v1/json/flight/AA/'+doc.flightNumber+'/departing/'+ moment(doc.date).format('YYYY/MM/DD')+'?appId=5ec701f5&appKey=3bdbf1102530fd93c44fb7ae5b49baa5',
          function (error, result) {
            if(!error){
                //console.log('content>>',result.content);
                console.log("Adding", doc);
                // Meteor.publish('mydata',result.content);
                doc.result = result.content;
                //check(doc, FlightData.simpleSchema());

                console.log('doc>',doc);
                FlightData.insert(doc, function(err, docID) {console.log("DocID: ", docID);});
          }
          });

  },
  /**
   *
   * Invoked by autoform to update a Student Data record.
   * @param doc The StudentData document.
   * @param docID It's ID.
   */
  updateFlightData: function(doc, docID) {
    console.log("Updating", doc);
    check(doc, FlightData.simpleSchema());
      FlightData.update({_id: docID}, doc);
  }
});

// Publish the entire Collection.  Subscription performed in the router.



/**
 * Create the schema for Student Data.
 * See: https://github.com/aldeed/meteor-autoform#common-questions
 * See: https://github.com/aldeed/meteor-autoform#affieldinput
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
        Meteor.subscribe(flightData);
        // counter starts at 0
        this.result = {};


    });



    Template.AddFlightData.helpers({
        result: function () {
            console.log('dd',Meteor.subscribe(flightData))
            return  Meteor.subscribe(flightData);
        }
    });

}