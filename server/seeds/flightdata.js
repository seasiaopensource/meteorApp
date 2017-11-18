/**
 * A list of sample Flight to pre-fill the Collection.
 * @type {*[]}
 */

var flightData = [
  {date: "01/01/1990", flightNumber: "123213"}
];

/**
 * Initialize the FlightData collection if empty.
 */
if (FlightData.find().count() === 0) {
  _.each(flightData,  function(flight) {
      FlightData.insert(flight);
  });
}
