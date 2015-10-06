import request from 'superagent';
import Debug from 'debug';

var debug = new Debug('client:query');
var userId = '0';

request
  .get('http://localhost:3000/data')
  .query({
    query: `{
      hello,
      employee(id: "${userId}") {
        firstName,
        lastName,
        title,
        department,
        email,
        mobilePhone,
        officePhone,
        city,
        twitterId,
        blog,
        pic,
        reports,
        manager {
          firstName,
          lastName,
          title,
          department,
          email,
          mobilePhone,
          officePhone,
          city,
          twitterId,
          blog,
          pic,
          reports
        }
      }
    }`
  })
  .end(function (err, res) {
    debug(err || res.body);
    debug('manager', res.body.data.employee.manager);
  });
