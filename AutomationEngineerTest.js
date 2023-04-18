// 1. Java Script.
// 1.1. Extend JS Date object with a method daysTo() which returns number of complete days between
// any pair of JS date objects: d1.daysTo(d2) should return quantity of complete days from d1 to
// d2.

Date.prototype.daysTo = function (otherDate) {
  const thisTime = this.getTime();
  const otherTime = otherDate.getTime();
  const diff = Math.abs(thisTime - otherTime);

  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const d1 = new Date(2023, 3, 1);
const d2 = new Date(2023, 3, 15);

const daysBetween = d1.daysTo(d2);

// 1.2. Please order by Total
// Develop a program which produces ordered array of sales. Input: array of objects with the
// following structure {amount: 10000, quantity: 10}. Output: new array of ordered sales. Array
// element structure should be: {amount: 10000, quantity: 10, Total: 100000}, where Total =
// amount * quantity. Please order by Total and note that input array shall remain intact.

const inputArray = [
  { amount: 10000, quantity: 10 },
  { amount: 5000, quantity: 20 },
  { amount: 20000, quantity: 5 },
];

const orderedSales = inputArray
  .map((sale) => {
    const total = sale.amount * sale.quantity;
    return { ...sale, Total: total };
  })
  .sort((a, b) => b.Total - a.Total);

// 1.3. Develop a program “Object Projection”. Input: any JSON object; prototype object. Output:
// projected object. Projected object structure shall be intersection of source object and
// prototype object structures. Values of properties in projected object shall be the same as
// values of respective properties in source object.

function projectObject(source, prototype) {
  const projectedObject = {};

  for (const prop in prototype) {
    if (source.hasOwnProperty(prop)) {
      if (typeof prototype[prop] === "object" && prototype[prop] !== null) {
        projectedObject[prop] = projectObject(source[prop], prototype[prop]);
      } else {
        projectedObject[prop] = source[prop];
      }
    }
  }

  return projectedObject;
}

const sourceObject = {
  prop11: {
    prop21: 21,
    prop22: {
      prop31: 31,
      prop32: 32,
    }
  },
  prop12: 12
};

const prototypeObject = {
  prop11: {
    prop22: null
  } 
};

const projectedObject = projectObject(sourceObject, prototypeObject);

console.log(projectedObject);

// 2. REST API
// 2.1. Develop a program in JS which returns array of free/busy intervals in a given time period for
// any shared Google calendar. Input: shared Google calendar

gapi.load('client', function() {
  gapi.client.init({
    apiKey: 'YOUR_API_KEY',
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    scope: 'https://www.googleapis.com/auth/calendar.readonly'
  }).then(function() {
    getFreeBusy('CALENDAR_ID', 'START_TIME', 'END_TIME').then(function(busyIntervals) {
      console.log(busyIntervals);
    });
  });
});

function getFreeBusy(calendarId, startTime, endTime) {
  return gapi.client.calendar.freebusy.query({
    calendarId: calendarId,
    timeMin: startTime,
    timeMax: endTime,
    timeZone: 'UTC'
  }).then(function(response) {
    const busyIntervals = response.result.calendars[calendarId].busy;
    return busyIntervals;
  });
}

// 3. SQL
// 3.1. Create tables and insert data
// 3.2. Select names of all empty test groups (group name starts with “TEST-”).
// 3.3. Select user first names and last names for the users that have Victor as a first name and are not
// members of any test groups (they may be members of other groups or have no membership in
// any groups at all).
// 3.4. Select users and groups for which user was created before the group for which he(she) is
// member of.

SELECT name
FROM 'group' g
LEFT JOIN groupMembership gm ON g.id = gm.groupID
WHERE g.name LIKE 'TEST%'
AND gm.id is NULL;

SELECT user.firstName, user.lastName
FROM user
WHERE user.firstName = 'Victor'
AND id NOT IN (
  SELECT DISTINCT userID
  FROM groupMembership gm
  INNER JOIN "group" g ON gm.groupID = g.id
  WHERE g.name LIKE 'TEST%'
);

SELECT u.*, g.*
FROM user u
JOIN groupMembership gm ON u.id = gm.userID
JOIN "group" g ON gm.groupID = g.id
WHERE g.created > gm.created;