<table class="table is-striped is-bordered is-narrow">
                        <thead>
                          <tr>
                            <td>Month</td>
                            <td>total attendance</td>
                            <td>early login</td>
                            <td>late login</td>
                            <td>early logout</td>
                            <td>late logout</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>January</td>
                            <td><%= jan_record.length %></td>
                            <td><%= jan_early_login %></td>
                            <td><%= jan_late_login %></td>
                            <td><%= jan_early_logout %></td>
                            <td><%= jan_late_logout %></td>
                          </tr>
                          <tr>
                              <td>Febuary</td>
                              <td><%= fe_record.length %></td>
                              <td><%= fe_early_login %></td>
                              <td><%= fe_late_login %></td>
                              <td><%= fe_early_logout %></td>
                              <td><%= fe_late_logout %></td>
                            </tr>
                            <tr>
                                <td>March</td>
                                <td><%= ma_record.length %></td>
                                <td><%= ma_early_login %></td>
                                <td><%= ma_late_login %></td>
                                <td><%= ma_early_logout %></td>
                                <td><%= ma_late_logout %></td>
                              </tr>
                              <tr>
                                  <td>April</td>
                                  <td><%= apr_record.length %></td>
                                  <td><%= apr_early_login %></td>
                                  <td><%= apr_late_login %></td>
                                  <td><%= apr_early_logout %></td>
                                  <td><%= apr_late_logout %></td>
                                </tr>
                                <tr>
                                    <td>May</td>
                                    <td><%= may_record.length %></td>
                                    <td><%= may_early_login %></td>
                                    <td><%= may_late_login %></td>
                                    <td><%= may_early_logout %></td>
                                    <td><%= may_late_logout %></td>
                                  </tr>
                                  <tr>
                                      <td>June</td>
                                      <td><%= jun_record.length %></td>
                                      <td><%= jun_early_login %></td>
                                      <td><%= jun_late_login %></td>
                                      <td><%= jun_early_logout %></td>
                                      <td><%= jun_late_logout %></td>
                                    </tr>
                                    <tr>
                                        <td>July</td>
                                        <td><%= jul_record.length %></td>
                                        <td><%= jul_early_login %></td>
                                        <td><%= jul_late_login %></td>
                                        <td><%= jul_early_logout %></td>
                                        <td><%= jul_late_logout %></td>
                                      </tr>
                                      <tr>
                                          <td>August</td>
                                          <td><%= aug_record.length %></td>
                                          <td><%= aug_early_login %></td>
                                          <td><%= aug_late_login %></td>
                                          <td><%= aug_early_logout %></td>
                                          <td><%= aug_late_logout %></td>
                                        </tr>
                                        <tr>
                                            <td>Septmber</td>
                                            <td><%= sep_record.length %></td>
                                            <td><%= sep_early_login %></td>
                                            <td><%= sep_late_login %></td>
                                            <td><%= sep_early_logout %></td>
                                            <td><%= sep_late_logout %></td>
                                          </tr>
                                          <tr>
                                              <td>October</td>
                                              <td><%= oct_record.length %></td>
                                              <td><%= oct_early_login %></td>
                                              <td><%= oct_late_login %></td>
                                              <td><%= oct_early_logout %></td>
                                              <td><%= oct_late_logout %></td>
                                            </tr>
                                            <tr>
                                                <td>November</td>
                                                <td><%= nov_record.length %></td>
                                                <td><%= nov_early_login %></td>
                                                <td><%= nov_late_login %></td>
                                                <td><%= nov_early_logout %></td>
                                                <td><%= nov_late_logout %></td>
                                              </tr>
                                              <tr>
                                                  <td>December</td>
                                                  <td><%= dec_record.length %></td>                      

                                                  <td><%= dec_early_login %></td>
                                                  <td><%= dec_late_login %></td>
                                                  <td><%= dec_early_logout %></td>
                                                  <td><%= dec_late_logout %></td>
                                                </tr>
                        </tbody>
                      </table>

mongoose.connect('mongodb://localhost:27017/cstdapi_db', { useNewUrlParser: true })
.then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));



//mongoose.connect('mongodb://cstd:nkenna007@ds045147.mlab.com:45147/heroku_p1wdhspx');


var numExpectedSources = 2;
var store = new MongoDBStore(
  {
    uri: 'mongodb://localhost:27017/cstdapi_db',  //connect_mongodb_session
    databaseName: 'cstdapi_db',
    collection: 'mySessions'
  },
  function(error) {
    // Should have gotten an error
    if(error){
    console.log(error)
    }
  });



  




mongoose.connect('mongodb://heroku_p1wdhspx:v75n2bmfigpsslule8iq2rlti1@ds045147.mlab.com:45147/heroku_p1wdhspx', { useNewUrlParser: true })
.then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));



//mongoose.connect('mongodb://cstd:nkenna007@ds045147.mlab.com:45147/heroku_p1wdhspx');


var numExpectedSources = 2;
var store = new MongoDBStore(
  {
    uri: 'mongodb://heroku_p1wdhspx:v75n2bmfigpsslule8iq2rlti1@ds045147.mlab.com:45147/heroku_p1wdhspx',  //connect_mongodb_session
    databaseName: 'heroku_p1wdhspx',
    collection: 'mySessions'
  },
  function(error) {
    // Should have gotten an error
    console.log(error)
  });

