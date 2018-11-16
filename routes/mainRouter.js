const express = require('express');
const app = express();
const mainRouter = express.Router();
var Papa = require('papaparse')
//mainRouter.options('*', cors()) 
const http = require("http");
var moment = require("moment");
const bodyParser = require('body-parser');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var fs = require('fs');
var multer = require('multer');
var pdf = require('html-pdf');
const fileUpload = require('express-fileupload');

app.use(fileUpload());

//var zingchart = require('zingchart')
mainRouter.use(bodyParser.urlencoded({ extended: false }));
mainRouter.use(bodyParser.json());

const Staff = require('../models/staff.model')
const Admin = require('../models/admin.model')
const Leave = require('../models/leave.model')
const Record = require('../models/attendance_records.model')
const CsvRecord = require('../models/csv.record.model')
const Doc = require('../models/doc.model')

const fileIn = fs.createWriteStream("login" + ".csv");
var duplicate_len = 6;

var staff_attendance = [];
var staff_leave_data = [];

var fileFolder = multer({
  limits: {fileSize: 200000},
  storage: '/media/uploads/'
})





mainRouter.use((req, res, next) => {
  if (req.cookies && !req.session.user) {
      res.clearCookie('admin');        
  }
  next();
});




mainRouter.use(function(req, res, next)
{
   /* Allow access from any requesting client */
   res.setHeader('Access-Control-Allow-Origin', '*');

   /* Allow access for any of the following Http request types */
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');

   /* Set the Http request header */
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    next();
});



mainRouter.route('/').get(function (req, res) {
  console.log("Finished::::");
  //http.get("http://192.168.0.103:80/download-out?token=cstd", response => {
  //var stream = response.pipe(fileIn);

  //stream.on("finish", function() {
   // console.log("done");
    
  //});
//})



if(!req.session.admin){
  var retVal = prompt("Enter Password to continue:", "Enter password here");
  return http.post("http://127.0.0.1/api/adminpin", {password: retVal}, (err, results) =>{console.log(results)})
  res.render('index');
}
res.render('index'); 
  
});

mainRouter.route('/upload').post((req, res) => {

  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  console.log(req.files.sampleFile)

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('public/media/filename.jpg', function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

mainRouter.route('/download-report').get((req, res) => {
  var html = fs.readFileSync('./views/staff-att.ejs', 'utf8');
  var options = { format: 'A4' };
  pdf.create(html).toStream(function(err, stream){
    //stream.pipe(fs.createWriteStream('./foo.pdf'));
    res.setHeader('Content-Type', 'application/pdf');
    res.send(stream.pipe(fs.createWriteStream('./foo.pdf')))
  });
})

mainRouter.route('/toprofile').get((req, res) => {
 
  var leave_data = []

    if(req.session.admin){
    //console.log(req.session.admin)
    Staff.find((err, staffs) => { 
      if(err){
        console.log(err);
        res.status(400).send('error retrieving data');
      }else{
        Leave.find((err, leaves) => {
          for (leave of leaves ) {
            if(moment().isBetween(leave.leave_start_date, leave.leave_end_date)){
              leave_data.push(leave) 
            }

          }
          console.log(leave_data)
          res.status(200).render('toprofile', {moment: moment, admin: req.session.admin, staffs: staffs, leaves: leave_data});
        })     
  
      }
    })
  }else{
    res.status(200).render('adminpin', {admin: req.session.admin});
  }
  
  
})



String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

mainRouter.route('/toprofile-filter').post((req, res) => {
  var pf = req.body.pf;
  var opt = req.body.opt;
  var leave_data = []
 

  if(req.session.admin){
    if(opt == 'optPF'  && pf == '' ){
      Staff.find((err, staffs) => {
        if(err){
          console.log(err);
          return res.status(500).send('error retrieving data');
        }else{
          Leave.find((err, leaves) => {
            for (leave of leaves ) {
              if(moment().isBetween(leave.leave_start_date, leave.leave_end_date)){
                leave_data.push(leave) 
              }
            }
            
            return res.status(200).render('toprofile', {moment: moment, admin: req.session.admin, staffs: staffs, leaves: leave_data});
          })
        }
      })
    }else if(opt == 'optName' && pf == '' ){
      Staff.find((err, staffs) => {
        if(err){
          console.log(err);
          return res.status(500).send('error retrieving data');
        }else{
          Leave.find((err, leaves) => {
            for (leave of leaves ) {
              if(moment().isBetween(leave.leave_start_date, leave.leave_end_date)){
                leave_data.push(leave) 
              }
            }
            
            return res.status(200).render('toprofile', {moment: moment, admin: req.session.admin, staffs: staffs, leaves: leave_data});
          })
        }
      })
    }else if(opt == 'optUnit' && pf == '' ){
      Staff.find((err, staffs) => {
        if(err){
          console.log(err);
          return res.status(500).send('error retrieving data');
        }else{
          Leave.find((err, leaves) => {
            for (leave of leaves ) {
              if(moment().isBetween(leave.leave_start_date, leave.leave_end_date)){
                leave_data.push(leave) 
              }
            }
            
            return res.status(200).render('toprofile', {moment: moment, admin: req.session.admin, staffs: staffs, leaves: leave_data});
          })
        }
      })
    }
    else if(opt == 'optPF'){
      Staff.find({PF: pf}, (err, staffs) => {
        if(err){
          console.log(err);
          res.status(500).send('error retrieving data');
        }else{
          Leave.find((err, leaves) => {
            for (leave of leaves ) {
              if(moment().isBetween(leave.leave_start_date, leave.leave_end_date)){
                leave_data.push(leave) 
              }
            }
               
            res.status(200).render('toprofile', {moment: moment, admin: req.session.admin, staffs: staffs, leaves: leave_data});
          })
        }
      })
    }else if (opt == 'optName'){
      Staff.find({lastname: pf.capitalizeFirstLetter()}, (err, staffs) => {
        if(err){
          console.log(err);
          res.status(500).send('error retrieving data');
        }else{
          Leave.find((err, leaves) => {
            for (leave of leaves ) {
              if(moment().isBetween(leave.leave_start_date, leave.leave_end_date)){
                leave_data.push(leave) 
              }
            }
           
            res.status(200).render('toprofile', {moment: moment, admin: req.session.admin, staffs: staffs, leaves: leave_data});
          })  
         
        }
      })
    }else if(opt == 'optUnit'){
      Staff.find({unit: pf.capitalizeFirstLetter()}, (err, staffs) => {
        if(err){
          console.log(err);
          res.status(500).send('error retrieving data');
        }else{
          Leave.find((err, leaves) => {
            for (leave of leaves ) {
              if(moment().isBetween(leave.leave_start_date, leave.leave_end_date)){
                leave_data.push(leave) 
              }
            }
           
            res.status(200).render('toprofile', {moment: moment, admin: req.session.admin, staffs: staffs, leaves: leave_data});
          })  
         
        }
      })
    }else{
      Staff.find({PF: opt}, (err, staffs) => {
        if(err){
          console.log(err);
          res.status(500).send('error retrieving data');
        }else{
          Leave.find((err, leaves) => {
            for (leave of leaves ) {
              if(moment().isBetween(leave.leave_start_date, leave.leave_end_date)){
                leave_data.push(leave) 
                
              }
            }
          
            res.status(200).render('toprofile', {moment: moment, admin: req.session.admin, staffs: staffs, leaves: leave_data});
          })  
         
        }
      })
    }

  }else{
    res.status(200).render('adminpin', {admin: req.session.admin});
  }

    
})

mainRouter.route('/toprofile').post((req, res) => {
  var pf = req.body.pf;
  console.log(pf);
  var pic = pf;
  staff_attendance = [];

  Staff.findOne({PF: pf}, (err, staff) => {
    if(err){
      return res.status(400).send('PF does not exist');
    }else{
      console.log(staff)
      
      if(staff == null){
        return res.status(400).send('<h2><strong>PF does not exist</strong></h2>'); 
      }else{
        Leave.find({PF: staff.PF}, (err, leaves) => {
          if(err){
            console.log('PF does not exist' + err);
            res.status(400).send('error in search') 
          }else{
            //console.log(leaves)
            var now = moment();
            
            CsvRecord.find({pf: staff.PF},(err, records) => {
              if(err){
                console.log(err)
              }else{
                for(var i = 0; i < records.length; i++){
                  if(moment().diff(moment(records[i].time), 'day') < 30){
                    staff_attendance.push(records[i]);
                   // console.log(staff_attendance.length)
                    
                  }
                  
                }
  
                Doc.find({PF: staff.PF}, (err, docs) => {
                  if (err){
                    return res.send(err)
                  }
  
                  res.render('profile', {docs: docs, admin: req.session.admin, staff: staff, leaves: leaves, moment: moment, rec: staff_attendance.length, pic: pic});
  
                })
                
                             
                
              }
            })
            
           
          }
        })
      }
      
      
      
    }
  })
})

mainRouter.route('/a-profile').get((req, res) => {
  var id = req.query.staffID;
  console.log(id);
  staff_attendance = [];
  var num;
  var pic = id;

  Staff.findOne({PF: id}, (err, staff) => {
    if(err){
      res.status(500).send('PF does not exist');
    }else{
      //res.render('profile', {staff: staff});
      Leave.find({PF: staff.PF}, (err, leaves) => {
        if(err){
          console.log(err);
          res.status(400).send('error in search')
        }else{
         // console.log(leaves)
           
          CsvRecord.find({pf: staff.PF},(err, records) => {
            if(err){
              console.log(err)
            }else{
              for(var i = 0; i < records.length; i++){
                if(moment().diff(moment(records[i].time), 'day') < 30){
                  staff_attendance.push(records[i]);
                  //console.log(staff_attendance.length)
                  
                }
                
              }

              Doc.find({PF: staff.PF}, (err, docs) => {
                if (err){
                  return res.send(err)
                }

                res.render('profile', {docs: docs, admin: req.session.admin, staff: staff, leaves: leaves, moment: moment, rec: staff_attendance.length, pic: pic});

              })
              
              //res.render('profile', {admin: req.session.admin, staff: staff, leaves: leaves, moment: moment, rec: staff_attendance.length, pic: pic});             
              
            }
          })
         
        }
      })
    }
  })
 
})

 

//mainRouter.route('/profile').get((req, res) => {
  //res.render('profile')
//})

mainRouter.route('/all-attendance').get((req, res) => {
  res.render('profile')
})


mainRouter.route('/editstaffview').post((req, res) => {
  if (req.session.admin) {
    var pf = req.body.pf;
    console.log(pf)
    Staff.findOne({PF: pf}, (err, staff) => {
      req.session.staff = staff
      res.status(200).render('editstaff', {staff: req.session.staff, status: 'Edit Staff details', admin: req.session.admin})
    })
    
  }else{
    res.status(200).render('adminpin', {admin: req.session.admin, moment: moment});
    
  }  
});

mainRouter.route('/editstaff').post((req, res) => {
 
   // var pf = req.body.pf;
    var unit = req.body.unit;
    var adminPF = req.session.admin.PF
    var mediafile = req.files.mediafile;
    var contenttype = req.files.mimetype

    console.log(req.files.name)

    if(Object.keys(req.files).length == 0){
      Staff.findOneAndUpdate({PF: req.session.staff.PF}, {unit: unit.capitalizeFirstLetter()}, {new: true}, (err, newStaff) => {
        if(err){
          return res.status(200).render('editstaff', {staff: newStaff, admin: req.session.admin, status: 'Error editing Staff detail' + err})
        }
        console.log(newStaff)
        res.status(200).render('editstaff', {staff: newStaff, admin: req.session.admin, status: 'Staff detail edited successfully!!!',})
      })
    } else {
      var mvpicPath = 'public/media/profilepic/' + req.session.staff.PF + '.jpg';
      var apiPath = '/media/profilepic/' + req.session.staff.PF + '.jpg';

      // Use the mv() method to place the file somewhere on your server
mediafile.mv(mvpicPath, function(err) {
if (err){
return res.status(500).send(err);
}

Staff.findOneAndUpdate({PF: req.session.staff.PF}, {mediafile: apiPath, contenttype: req.files.mimetype, unit: unit}, {new: true}, (err, newStaff) => {
if(err){
  return res.status(200).render('editstaff', {staff: newStaff, admin: req.session.admin, status: 'Error editing Staff detail' + err})
}
res.status(200).render('editstaff', {staff: newStaff, status: 'Edit Staff details', admin: req.session.admin})

}); 
    })
  }
     
});




mainRouter.route('/adminpin').get((req, res) => {
  var active_leaves = 0
  var data = []; 
  console.log(req.session.admin)
  if (req.session.admin) {
    //res.render('adminboard')
    var password = req.body.password;
  //console.log(password)

 
  //var active_leaves = 0

  staff_leave_data = []

 
  Admin.findOne({password: password}, (err, admin) => {
    if(err){
      console.log(err)
      res.status(400).send('password invalid')
    }else{
      Staff.countDocuments((err, number) => {
        if(err){
          console.log(error);
        }else{
          Leave.find((err, leaves) => {
             
            if(err){
              return res.status(400).send(err)
            }

            leaves.forEach((l, index) => {
              
            //  console.log(moment().isBetween(l.leave_start_date, l.leave_end_date))
              if(moment().isBetween(l.leave_start_date, l.leave_end_date)){
                active_leaves += 1;
                data.push(l)
              }
            })

            
            
            res.status(200).render('adminboard', {status: 'Upload Staff Document', active_leaves: active_leaves, admin: req.session.admin, number: number, leaveData: data, moment: moment}) 
            
          })
          
          
        }
      })
      
    }
  })
  }else{
    
    res.status(200).render('adminpin', {admin: req.session.admin, moment: moment});
    
  }
  
});

mainRouter.route('/adminboard').get((req, res) => {
  var password = req.session.admin.password;
  console.log(password)
  var active_leaves = 0
  var data = []; 

  Admin.findOne({password: password}, (err, admin) => {
    if(err){
      console.log(err)
      res.status(400).send('password invalid')
    }else{
      Staff.countDocuments((err, number) => {
        if(err){
          console.log(error);
        }else{
          CsvRecord.find((err, all_records) => {
            if(err){

            }else{
             

              leaves.forEach((l, index) => {
              
                console.log(moment().isBetween(l.leave_start_date, l.leave_end_date))
                if(moment().isBetween(l.leave_start_date, l.leave_end_date)){
                  active_leaves += 1;
                  data.push(l)
                }
              })

            }
            req.session.admin = admin;
          res.status(200).render('adminboard', {status: 'Upload Staff Document', leaveData: data, active_leaves: active_leaves, moment: moment, admin: admin, number: number})
          })
          
        }
      })
      
    }
  })
 
  
});

mainRouter.route('/adminboard').post( (req, res) => {
  var password = req.body.password;
  //console.log(password)

  var data = []; 
  var active_leaves = 0
  

  staff_leave_data = []

 
  Admin.findOne({password: password}, (err, admin) => {
    if(err){
      console.log(err)
      res.status(400).send('password invalid')
    }else{
      Staff.countDocuments((err, number) => {
        if(err){
          console.log(error);
        }else{
          Leave.find((err, leaves) => {
             
            if(err){
              return res.status(400).send(err)
            }

            leaves.forEach((l, index) => {
              
              console.log(moment().isBetween(l.leave_start_date, l.leave_end_date))
              if(moment().isBetween(l.leave_start_date, l.leave_end_date)){
                active_leaves += 1;
                data.push(l)
              }
            })

            req.session.admin = admin;
            
            res.status(200).render('adminboard', {status: 'Upload Staff Document', leaveData: data, active_leaves: active_leaves, admin: admin, number: number, moment: moment}) 
            
          })
          
          
        }
      })
      
    }
  })
 
});

mainRouter.route('/edit-leave').post( (req, res) => {
  var ID = req.session.leave._id;
  var leave_type = req.body.leave_type;
  var startdate  = req.body.startdate;
  var enddate = req.body.enddate;
  var staffpf = req.body.staffpf;
  var adminpf = req.body.adminpf;

  console.log(88)
  console.log(ID)

  Leave.findByIdAndUpdate(ID, {leave_type: leave_type, leave_start_date: startdate, leave_end_date: enddate, updatedby: adminpf, updated_date: Date.now()}, {new: true}, (err, newLeave) => {
    if(err){
      return res.send(err)
    }

    req.session.leave= newLeave
      console.log(req.session.leave)

    Doc.find({ID: newLeave._id}, (err, docs) => {
      
      res.status(200).render('leaveboard', {admin: req.session.admin, docs: docs, status: 'Leave updated', status1: 'Leave Details', leave: req.session.leave, moment: moment});
    })

    
  })

    
})

mainRouter.route('/logout').get( (req, res) => {
  req.session.clearCookie;
  
  req.session.destroy(err => {
    console.log(err)
  })
  res.redirect('/')
})

mainRouter.route('/new-staff').get((req, res) => {
  var adminPF =  req.session.admin
  console.log(adminPF.PF)
  res.status(200).render('newstaff', {admin: req.session.admin, status: 'Enter Staff details', adminPF: adminPF.PF});
})


//create new staff
mainRouter.route('/new-staff').post( (req, res) => {
 
  
  var firstname = req.body.firstname;
  var middlename = req.body.middlename;
  var lastname = req.body.lastname;
  var pf = req.body.pf;
  var unit = req.body.unit;
  var sex = req.body.sex;
  var mediafile = req.files.mediafile; //file pat
  var contenttype = req.files.mimetype;
  var adminPF =  req.body.admPF
  console.log(adminPF)
 

  if (Object.keys(req.files).length == 0) {
    return res.status(400).render('newstaff', {admin: req.session.admin, adminPF: adminPF, status: 'No file was selected'})
  }

  Staff.countDocuments({PF: pf}, ((err, number) => {
    if(err){
      console.log(error)
      res.status(400).send('error countin staff');
    }else{
      if(number == 0){
        const staff = new Staff({
          firstname: firstname.capitalizeFirstLetter(),
          middlename: middlename.capitalizeFirstLetter(),
          lastname: lastname.capitalizeFirstLetter(),
          PF: pf,
          sex: sex,
          unit: unit.capitalizeFirstLetter(),
          createdby: adminPF,
          contentType: contenttype
        });
        staff.save().then(staff => {
          // destination.txt will be created or overwritten by default.
          //save pic
          var mvpicPath = 'public/media/profilepic/' + staff.PF + '.jpg';
        ;
      var apiPath = '/media/profilepic/' + staff.PF + '.jpg';

            // Use the mv() method to place the file somewhere on your server
  mediafile.mv(mvpicPath, function(err) {
    if (err){
      return res.status(500).send(err);
    }

    Staff.findOneAndUpdate({PF: staff.PF}, {mediafile: apiPath}, {new: true}, (err, newStaff) => {
      if(err){
        return res.status(200).render('newstaff', {admin: req.session.admin, adminPF: adminPF, status: 'Error creating new Staff ' + err})
      }
      res.status(200).render('newstaff', {admin: req.session.admin, adminPF: adminPF, status: 'New Staff created!!!',})
    })
    
  });         
        }).catch(error => {
          
          res.status(400).render('newstaff', {adminPF: adminPF.PF, status: 'error saving staff',})
        })
      }else{
        res.status(400).render('newstaff', {adminPF: adminPF.PF, status: 'Staff with PF already exist'})
       
      }
    }
  }))
  

})

mainRouter.route('/upload-file').post((req, res) => {
  var title = req.body.title;
  var note = req.body.note;
  var LID = req.body.LID;
  var pf = req.body.staffpf;
  var uploadedby = req.body.adminpf
  var mediafile = req.files.mediafile; //file pat
  var contenttype = req.files.mimetype;
  
  //var picPath = 
  
 console.log(req.files)

  if (Object.keys(req.files).length == 0) {
    return res.status(400).render('newstaff', {admin: req.session.admin, adminPF: adminPF, status: 'No file was selected'})
  }

  var doc = new Doc ({
    PF: pf,
  ID: LID,
  note: note,
  title: title,
  uploadedby: uploadedby,
  contentType: contenttype
  })

  doc.save().then(doc => {

   

    var link = 'public/media/docs/' + mediafile.name;
    var apilink = '/media/docs/' + mediafile.name;
          // Use the mv() method to place the file somewhere on your server
  mediafile.mv(link, function(err) {
    if (err){
      return res.status(500).send(err);
    }

    Doc.findOneAndUpdate({_id: doc._id}, {link: apilink}, {new: true}, (err, newDoc) => {
      if (err){
        return res.status(500).send(err);
      }

      Leave.findOne({PF: newDoc.PF}, (err, leave) => {
        if (err){
          return res.status(500).send(err);
        }
        Doc.find({ID: newDoc.ID}, (err, docs) => {
          if (err){
            return res.status(500).send(err);
          }

          console.log(leave)
          res.status(200).render('leaveboard', {admin: req.session.admin, docs: docs, status: 'Document uploaded', status1: 'Leave Details', leave: leave, moment: moment});
        })
        
      })      

    })
  })
}).catch(err => {
  return res.send(err)
})

})

mainRouter.route('/upload-staff-file').post((req, res) => {
  var title = req.body.title;
  var note = req.body.note;
  var pf = req.body.pf;
  var uploadedby = req.session.admin.PF
  var mediafile = req.files.mediafile; //file pat
  var contenttype;// = req.files.mediafile.mimetype;
  var active_leaves = 0
  var data = []; 
  
  //var picPath = 
  console.log(uploadedby);
 console.log(req.files);


  if (Object.keys(req.files).length == 0) {
    //return res.status(400).render('newstaff', {adminPF: adminPF, status: 'No file was selected'})
  }

  var doc = new Doc ({
    PF: pf,
   note: note,
  title: title,
  uploadedby: uploadedby,
  contentType: contenttype
  })

  doc.save().then(doc => {

    var link = 'public/media/docs/' + mediafile.name;
    var apilink = '/media/docs/' + mediafile.name;
          // Use the mv() method to place the file somewhere on your server
  mediafile.mv(link, function(err) {
    if (err){
      return res.status(500).send(err);
    }

    Doc.findOneAndUpdate({_id: doc._id}, {link: apilink}, {new: true}, (err, newDoc) => {
      if (err){
        return res.status(500).send(err);
      }

      Staff.countDocuments((err, number) => {
        if(err){
          console.log(error);
        }else{

      Leave.find((err, leaves) => {
           
        if(err){
          return res.status(400).send(err)
        }

        leaves.forEach((l, index) => {
          
          console.log(moment().isBetween(l.leave_start_date, l.leave_end_date))
          if(moment().isBetween(l.leave_start_date, l.leave_end_date)){
            active_leaves += 1;
            data.push(l)
          }
        })

        
        
        res.status(200).render('adminboard', {status: 'File uploaded successfully', active_leaves: active_leaves, admin: req.session.admin, number: number, leaveData: data, moment: moment}) 
        
      })
    }
  })

    })
  })
}).catch(err => {
  return res.send(err)
})

})



mainRouter.route('/data').get((req, res) => {
  if(req.session.admin){
    res.status(200).render('data', {admin: req.session.admin, moment: moment});
  }else{
    res.status(200).render('adminpin', {admin: req.session.admin, moment: moment});
   
  }
  
})

function makeLeaveTitle() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

mainRouter.route('/new-staff-leave').get((req, res) => {
  if(req.session.admin){
    res.status(200).render('createleave', {admin: req.session.admin, status: 'Create New Leave'});
  }else{
    res.redirect('/')
  }
  
})


mainRouter.route('/new-staff-leave').post((req, res) => {
  var adminPF = req.session.admin
  var pf = req.body.pf;
  var leave_type = req.body.leave_type;
  var startdate = req.body.startdate;
  var enddate = req.body.enddate;
  var title = adminPF.PF + makeLeaveTitle()

  Leave.countDocuments({leave_start_date: startdate, leave_end_date: enddate, PF: pf, createdby: adminPF.PF}, (err, number) =>{
    if(err){
      console.log(err)
    }else{
      if(number == 0){
        const leave = new Leave({
          PF: pf,
          leave_type: leave_type,
          leave_start_date: startdate,
          leave_end_date: enddate,
          title: title,
          createdby: adminPF.PF
      
        })
      
        leave.save().then(leave => {
          Doc.find({ID: leave._id}, (err, docs) => {
            res.status(200).render('leaveboard', {admin: req.session.admin, docs: docs, status: '', status1: 'Leave Details', leave: leave, moment: moment});
          })
          
        }).catch(err => {
          res.status(400).render('createleave', {admin: req.session.admin, status: 'Error Creating Leave!!!!', moment: moment});
        })
      }else if(number > 0){
        console.log('duplicate')
        Leave.findOne({leave_start_date: startdate, leave_end_date: enddate, PF: pf, createdby: adminPF.PF}, (err, l) => {
          if(err){
            return res.status(400).send(err)
          }else{
            Doc.find({ID: l._id}, (err, docs) => {
              res.status(200).render('leaveboard', {admin: req.session.admin, docs: docs, moment: moment, status1: '', status: 'You are trying to duplicate this leave record: ' + l.title, leave: l});
            })
            
          }
        })
        //res.redirect('/new-staff-leave');
      }
    }
  }) 
  
})

mainRouter.route('/leaveboard').get((req, res) => {
  var ID = req.query.ID;

  Leave.findById(ID, (err, leave) => {
    if (err){
      return res.send(err)
    }

    console.log(leave)
    req.session.leave = leave

    Doc.find({ID: leave._id}, (err, docs) => {
      res.status(200).render('leaveboard', {admin: req.session.admin, docs: docs, status: '', status1: 'Leave Details', leave: leave, moment: moment});
    })

  }) 
})



mainRouter.route('/new-admin').post((req, res) => {
  
  var username = req.body.username;
  var password = req.body.password;
  var role = req.body.role;
  var PF = req.body.PF;
  var createdby = req.session.admin.PF

  const admin = new Admin({
    username: username,
    password: password,
    role: role,
    PF: PF,
    createdby: createdby
  })

  Admin.countDocuments({PF: PF}, (err, count) => {
    if(err){
      return res.send(err)
    }

    if(count > 0){
      return res.render('createadmin', {admin: req.session.admin, status: 'Admin with PF number ' + PF + ' already exist.' })
    }else{
      admin.save().then(admin => {
   
        res.status(200).render('admindetails', {admin: req.session.admin, adminData: admin, moment: moment, status: 'Saved, Click the Edit button if you wish to change any detail here'}) 
      }).catch(error => {
        res.status(400).send('error in save')
      })
    }
  })

  
})

mainRouter.route('/parse-csv').get(function (req, res) {
  console.log("Finished::::");
  http.get("http://192.168.0.103:80/download-out?token=cstd", response => {
  var stream = response.pipe(fileIn);

  stream.on("finish", function() {
    console.log("done");
    
  });
})
})

mainRouter.route('/parse-csv-file').get(function (req, res) {
  if(req.session.admin){
    res.render('attendance-data') 
  }else{
    res.redirect('/')
  }
  
})

mainRouter.route('/parse-csv-file').post(function (req, res) {
  console.log("Finished::::");
 console.log(req.files.csvfile)
  var csvfile = req.files.csvfile.name;
  
  var error_len = 0;
  var saved_len = 0;
  var data_len = 0;
  //duplicate_len = 0;

  console.log(csvfile);  

  if (Object.keys(req.files).length == 0) {
    //return res.status(400).render('newstaff', {adminPF: adminPF, status: 'No file was selected'})
    return console.log('No file was selected')
  }

   const rr = fs.createReadStream(csvfile);
rr.on('readable', () => {
  rr.read()
  //console.log(`readable: ${rr.read()}`);
});

rr.on('end', () => {
console.log('end');
});


   Papa.parse(rr, { 
   complete: function(results) {
    

    data_len = results.data.length;
    error_len = results.errors.length
     
     for(let i = 0; i < results.data.length; i++){
       
      CsvRecord.countDocuments({time: results.data[i][0]}, (err, number) => {
        duplicate_len = 8//+= number;

        if (err){
          //return res.status(400).send('error in operation')
          console.log(err)
        }else{
          if (number == 0){

            //console.log(i);
            //console.log(results.data[i][0])
            let pf = results.data[i]['1'];
            let event = results.data[i]['2'];
            let time = results.data[i]['0'];

            var csvrecord = new CsvRecord({
              time: time,
              pf: pf,
             event: event
             
            });

            csvrecord.save().then(csvR => {
              saved_len += 1
              //console.log(csvR)
            }).catch(err => {
              console.log(err)
            })
            
          }else{
            //duplicate_len += 1
            console.log('duplicate')
          }
        }
      })
      
     }
     var uploadData = {
       data_len: data_len,
       saved_len: saved_len,
       duplicate_len: duplicate_len,
       error_len: error_len
     }

     console.log(uploadData)
     res.render('attendance-data', {results: results.data, admin: req.session.admin, uploadData: uploadData })
     
    }
 });
})

mainRouter.route('/add-record').post((req, res) => {
  
  var name = req.body.name;
  var pf = req.body.pf;
  var unit = req.body.unit;
  var event = req.body.event;
  var status = req.body.status;
  var time = req.body.time;

  console.log(name)

  
  //retrieve year, mon, day, hr, minute
  var timeYear = moment(time).get('year');
  var timeMon = moment(time).get('month');
  var timeDay = moment(time).date();
  var timehr = moment(time).get('hour');
  var timeMin = moment(time).get('minute');

  console.log(timeYear)
  console.log(timeMin)
  
  var flag = false;

  Record.countDocuments({time: time, pf: pf}, (err, number) => {
    if(err){
      console.log(err)
      res.send('error')
    }else{
      if(number == 0){
        var re = new Record({
          name: name,
          pf: pf,
          unit: unit,
          event: event,
          status: status,
          time: time
        });

        re.save().then(re => {
          res.status(200).send('success')
        }).catch(err => {
          res.status(400).send('error')
        })

      }else{
        res.send('record duplicate')
      }
    }
  })

})



mainRouter.route('/staff-att').get((req, res) => {
  var stat = false;
  if(req.session.admin){
    
  }else{
    
  }

  var staffPF = req.query.staffPF;
  var year = req.query.year;
  
  Staff.findOne({PF: staffPF}, (err, st) => {

  })

  var ja_record = 0//array to hold all january records
  var ja_early_record = 0//array to hold all january records and early logins
  var ja_late_record = 0//array to hold all january records and late logins
  var ja_earlyL_record = 0//array to hold all january records and early logouts
  var ja_lateL_record = 0//array to hold all january records and late logouts


  var fe_record = 0//array to hold all feb records
  var fe_early_record = 0//array to hold all feb records and early logins
  var fe_late_record = 0//array to hold all feb records and late logins
  var fe_earlyL_record = 0//array to hold all feb records and early logouts
  var fe_lateL_record = 0//array to hold all feb records and late logouts

  var ma_record = 0//array to hold all mar records
  var ma_early_record = 0//array to hold all mar records and early logins
  var ma_late_record = 0//array to hold all mar records and late logins
  var ma_earlyL_record = 0//array to hold all mar records and early logouts
  var ma_lateL_record = 0//array to hold all mar records and late logouts

  var apr_record = 0//array to hold all apr records
  var apr_early_record = 0//array to hold all apr records and early logins
  var apr_late_record = 0//array to hold all apr records and late logins
  var apr_earlyL_record = 0//array to hold all apr records and early logouts
  var apr_lateL_record //array to hold all apr records and late logouts

  var may_record = 0//array to hold all may records
  var may_early_record = 0//array to hold all may records and early logins
  var may_late_record = 0//array to hold all may records and late logins
  var may_earlyL_record = 0//array to hold all may records and early logouts
  var may_lateL_record = 0//array to hold all may records and late logouts

  var jun_record = 0//array to hold all jun records
  var jun_early_record = 0//array to hold all jun records and early logins
  var jun_late_record = 0//array to hold all jun records and late logins
  var jun_earlyL_record = 0//array to hold all jun records and early logouts
  var jun_lateL_record = 0//array to hold all jun records and late logouts

  var jul_record = 0//array to hold all jul records
  var jul_early_record = 0//array to hold all jul records and early logins
  var jul_late_record = 0//array to hold all jul records and late logins
  var jul_earlyL_record = 0//array to hold all jul records and early logouts
  var jul_lateL_record = 0//array to hold all jul records and late logouts

  var aug_record = 0//array to hold all aug records
  var aug_early_record = 0//array to hold all aug records and early logins
  var aug_late_record = 0//array to hold all aug records and late logins
  var aug_earlyL_record = 0//array to hold all aug records and early logouts
  var aug_lateL_record = 0//array to hold all aug records and late logouts

  var sep_record = 0//array to hold all sep records
  var sep_early_record = 0//array to hold all sep records and early logins
  var sep_late_record = 0//array to hold all sep records and late logins
  var sep_earlyL_record = 0//array to hold all sep records and early logouts
  var sep_lateL_record = 0//array to hold all sep records and late logouts

  var oct_record = 0//array to hold all oct records
  var oct_early_record = 0//array to hold all oct records and early logins
  var oct_late_record = 0//array to hold all oct records and late logins
  var oct_earlyL_record = 0//array to hold all oct records and early logouts
  var oct_lateL_record = 0//array to hold all oct records and late logouts

  var nov_record = 0//array to hold all nov records
  var nov_early_record = 0//array to hold all nov records and early logins
  var nov_late_record = 0//array to hold all nov records and late logins
  var nov_earlyL_record = 0//array to hold all nov records and early logouts
  var nov_lateL_record = 0//array to hold all nov records and late logouts

  var dec_record = 0//array to hold all dec records
  var dec_early_record = 0//array to hold all dec records and early logins
  var dec_late_record = 0//array to hold all dec records and late logins
  var dec_earlyL_record = 0//array to hold all dec records and early logouts
  var dec_lateL_record = 0//array to hold all dec records and late logouts

  Staff.findOne({PF: staffPF}, (err, staff) => {
    if(err){
      return res.send(err) 
    }else{
      CsvRecord.find({pf: staff.PF}, (err, records) => {
        
        //find all records in January
        records.forEach((jan_record, index) => {
          
          if (moment(jan_record.time).get('month') == 0 && moment(jan_record.time).get('year') == year){            
            ja_record += 1
          }else if(moment(jan_record.time).get('month') == 1 && moment(jan_record.time).get('year') == year){
            fe_record += 1
            }else if(moment(jan_record.time).get('month') == 2 && moment(jan_record.time).get('year') == year){
              ma_record += 1
          }else if(moment(jan_record.time).get('month') == 3 && moment(jan_record.time).get('year') == year){
            apr_record += 1
            }else if(moment(jan_record.time).get('month') == 4 && moment(jan_record.time).get('year') == year){
              may_record += 1
              }else if(moment(jan_record.time).get('month') == 5 && moment(jan_record.time).get('year') == year){
                jun_record += 1
                }else if(moment(jan_record.time).get('month') == 6 && moment(jan_record.time).get('year') == year){
                  jul_record+= 1;
                  }else if(moment(jan_record.time).get('month') == 7 && moment(jan_record.time).get('year') == year){
                    aug_record+= 1;
                    }else if(moment(jan_record.time).get('month') == 8 && moment(jan_record.time).get('year') == year){
                      sep_record+= 1;
                      }else if(moment(jan_record.time).get('month') == 9 && moment(jan_record.time).get('year') == year){
                        oct_record+= 1;
                        }else if(moment(jan_record.time).get('month') == 10 && moment(jan_record.time).get('year') == year){
                          nov_record+= 1;
                          }else if(moment(jan_record.time).get('month') == 11 && moment(jan_record.time).get('year') == year){
                            dec_record+= 1;
                            }

          //find all records in January and is early login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 0 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') > 30 && jan_record.event == 'login'){
            ja_late_record =+ 1
            
          }

          //find all records in January and is early login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 0 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') <= 30 && jan_record.event == 'login'){
            ja_early_record =+ 1
            
          }          

          //find all records in January and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 0 && moment(jan_record.time).get('hour') > 9 && jan_record.event == 'login'  ){
            ja_late_record =+ 1        
            
          }

          //find all records in January and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 0 && moment(jan_record.time).get('hour') < 9 && jan_record.event == 'login'  ){
            ja_early_record =+ 1        
            
          }

          //find all records in January and is early logout
          if ( moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 0 && moment(jan_record.time).get('hour') < 4 && jan_record.event == 'logout'){
            console.log('')
            ja_earlyL_record =+ 1
          }

          //find all records in January and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 0 && moment(jan_record.time).get('hour') > 5 && jan_record.event == 'logout'){
            console.log('')
            ja_lateL_record =+ 1
          }

          //find all records in January and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 0 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') < 45 && jan_record.event == 'logout'){
            console.log('')
            ja_earlyL_record =+ 1
          }

          //find all records in January and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 0 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') >= 45 && jan_record.event == 'logout'){
            console.log('')
            ja_lateL_record =+ 1
          }

          //febuary
           //find all records in January and is early login
           if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 1 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') > 30 && jan_record.event == 'login'){
            fe_late_record += 1
            
          }

          //find all records in January and is early login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 1 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') <= 30 && jan_record.event == 'login'){
            fe_early_record += 1
            
          }          

          //find all records in January and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 1 && moment(jan_record.time).get('hour') > 9 && jan_record.event == 'login'  ){
            fe_late_record += 1         
            
          }

          //find all records in January and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 1 && moment(jan_record.time).get('hour') < 9 && jan_record.event == 'login'  ){
            fe_early_record+= 1;         
            
          }

          //find all records in January and is early logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 1 && moment(jan_record.time).get('hour') < 4 && jan_record.event == 'logout'){
            console.log('')
            fe_earlyL_record += 1
          }

          //find all records in January and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 1 && moment(jan_record.time).get('hour') > 5 && jan_record.event == 'logout'){
            console.log('')
            fe_lateL_record += 1
          }

          //find all records in January and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 1 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') < 45 && jan_record.event == 'logout'){
            console.log('')
            fe_earlyL_record += 1
          }

          //find all records in January and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 1 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') >= 45 && jan_record.event == 'logout'){
            console.log('')
            fe_lateL_record += 1
          }


          //mar
           //find all records in mar and is early login
           if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 2 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') > 30 && jan_record.event == 'login'){
            ma_late_record  += 1
            
          }

          //find all records in mar and is early login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 2 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') <= 30 && jan_record.event == 'login'){
            ma_early_record  += 1
            
          }          

          //find all records in mar and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 2 && moment(jan_record.time).get('hour') > 9 && jan_record.event == 'login'  ){
            ma_late_record  += 1         
            
          }

          //find all records in mar and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 2 && moment(jan_record.time).get('hour') < 9 && jan_record.event == 'login'  ){
            ma_early_record  += 1        
            
          }

          //find all records in mar and is early logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 2 && moment(jan_record.time).get('hour') < 4 && jan_record.event == 'logout'){
            
            ma_earlyL_record  += 1
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 2 && moment(jan_record.time).get('hour') > 5 && jan_record.event == 'logout'){
            
            ma_lateL_record  += 1
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 2 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') < 45 && jan_record.event == 'logout'){
           
            ma_earlyL_record  += 1
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 2 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') >= 45 && jan_record.event == 'logout'){
            
            ma_lateL_record  += 1
          }


           //apr
           //find all records in mar and is early login
           if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 3 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') >= 30 && jan_record.event == 'login'){
            apr_late_record  += 1
            
          }

          //find all records in mar and is early login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 3 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') < 30 && jan_record.event == 'login'){
            apr_early_record  += 1
            
          }          

          //find all records in mar and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 3 && moment(jan_record.time).get('hour') > 9 && jan_record.event == 'login'  ){
            apr_late_record  += 1        
            
          }

          //find all records in mar and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 3 && moment(jan_record.time).get('hour') < 9 && jan_record.event == 'login'  ){
            apr_early_record  += 1        
            
          }

          //find all records in mar and is early logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 3 && moment(jan_record.time).get('hour') < 4 && jan_record.event == 'logout'){
            
            apr_earlyL_record  += 1
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 3 && moment(jan_record.time).get('hour') > 5 && jan_record.event == 'logout'){
            console.log('')
            apr_lateL_record  += 1
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 3 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') < 45 && jan_record.event == 'logout'){
            
            apr_earlyL_record  += 1
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 3 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') >= 45 && jan_record.event == 'logout'){
            
            apr_lateL_record  += 1
          }

           //may
           //find all records in mar and is early login
           if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 4 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') > 30 && jan_record.event == 'login'){
            may_late_record  += 1
            
          }

          //find all records in mar and is early login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 4 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') <= 30 && jan_record.event == 'login'){
            may_early_record  += 1
            
          }          

          //find all records in mar and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 4 && moment(jan_record.time).get('hour') > 9 && jan_record.event == 'login'  ){
            may_late_record  += 1        
            
          }

          //find all records in mar and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 4 && moment(jan_record.time).get('hour') < 9 && jan_record.event == 'login'  ){
            may_early_record  += 1       
            
          }

          //find all records in mar and is early logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 4 && moment(jan_record.time).get('hour') < 4 && jan_record.event == 'logout'){
            
            may_earlyL_record  += 1
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 4 && moment(jan_record.time).get('hour') > 5 && jan_record.event == 'logout'){
            
            may_lateL_record  += 1
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 4 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') < 45 && jan_record.event == 'logout'){
            
            may_earlyL_record  += 1
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 4 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') >= 45 && jan_record.event == 'logout'){
            
            may_lateL_record  += 1
          }


           //june
           //find all records in mar and is early login
           if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 5 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') > 30 && jan_record.event == 'login'){
            jun_late_record+= 1;
            
          }

          //find all records in mar and is early login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 5 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') <= 30 && jan_record.event == 'login'){
            jun_early_record+= 1;
            
          }          

          //find all records in mar and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 5 && moment(jan_record.time).get('hour') > 9 && jan_record.event == 'login'  ){
            jun_late_record+= 1;         
            
          }

          //find all records in mar and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 5 && moment(jan_record.time).get('hour') < 9 && jan_record.event == 'login'  ){
            jun_early_record+= 1;         
            
          }

          //find all records in mar and is early logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 5 && moment(jan_record.time).get('hour') < 4 && jan_record.event == 'logout'){
            console.log('')
            jun_earlyL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 5 && moment(jan_record.time).get('hour') > 5 && jan_record.event == 'logout'){
            console.log('')
            jun_lateL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 5 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') < 45 && jan_record.event == 'logout'){
            console.log('')
            jun_earlyL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 5 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') >= 45 && jan_record.event == 'logout'){
            console.log('')
            jun_lateL_record+= 1;
          }


           //july
           //find all records in mar and is early login
           if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 6 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') > 30 && jan_record.event == 'login'){
            jul_late_record+= 1;
            
          }

          //find all records in mar and is early login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 6 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') <= 30 && jan_record.event == 'login'){
            jul_early_record+= 1;
            
          }          

          //find all records in mar and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 6 && moment(jan_record.time).get('hour') > 9 && jan_record.event == 'login'  ){
            jul_late_record+= 1;         
            
          }

           //find all records in mar and is late login
           if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 6 && moment(jan_record.time).get('hour') < 9 && jan_record.event == 'login'  ){
            jul_early_record+= 1;         
            
          }

          //find all records in mar and is early logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 6 && moment(jan_record.time).get('hour') < 4 && jan_record.event == 'logout'){
            console.log('')
            jul_earlyL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 6 && moment(jan_record.time).get('hour') > 5 && jan_record.event == 'logout'){
            console.log('')
            jul_lateL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 6 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') < 45 && jan_record.event == 'logout'){
            console.log('')
            jul_earlyL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 6 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') >= 45 && jan_record.event == 'logout'){
            console.log('')
            jul_lateL_record+= 1;
          }

           //aug
           //find all records in mar and is early login
           if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 7 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') > 30 && jan_record.event == 'login'){
            aug_late_record+= 1;
            
          }

          //find all records in mar and is early login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 7 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') <= 30 && jan_record.event == 'login'){
            aug_early_record+= 1;
            
          }          

          //find all records in mar and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 7 && moment(jan_record.time).get('hour') > 9 && jan_record.event == 'login'  ){
            aug_late_record+= 1;         
            
          }

          //find all records in mar and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 7 && moment(jan_record.time).get('hour') < 9 && jan_record.event == 'login'  ){
            aug_early_record+= 1;         
            
          }

          //find all records in mar and is early logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 7 && moment(jan_record.time).get('hour') < 4 && jan_record.event == 'logout'){
            console.log('')
            aug_earlyL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 7 && moment(jan_record.time).get('hour') > 5 && jan_record.event == 'logout'){
            console.log('')
            aug_lateL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 7 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') < 45 && jan_record.event == 'logout'){
            console.log('')
            aug_earlyL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 7 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') >= 45 && jan_record.event == 'logout'){
            console.log('')
            aug_lateL_record+= 1;
          }

           //sept
           //find all records in mar and is early login
           if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 8 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') > 30 && jan_record.event == 'login'){
            sep_late_record+= 1;
            
          }

          //find all records in mar and is early login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 8 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') <= 30 && jan_record.event == 'login'){
            sep_early_record+= 1;
            
          }          

          //find all records in mar and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 8 && moment(jan_record.time).get('hour') > 9 && jan_record.event == 'login'  ){
            sep_late_record+= 1;         
            
          }

          //find all records in mar and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 8 && moment(jan_record.time).get('hour') < 9 && jan_record.event == 'login'  ){
            sep_early_record+= 1;         
            
          }

          //find all records in mar and is early logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 8 && moment(jan_record.time).get('hour') < 4 && jan_record.event == 'logout'){
            console.log('')
            sep_earlyL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 8 && moment(jan_record.time).get('hour') > 5 && jan_record.event == 'logout'){
            console.log('')
            sep_lateL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 8 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') < 45 && jan_record.event == 'logout'){
            console.log('')
            sep_earlyL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 8 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') >= 45 && jan_record.event == 'logout'){
            console.log('')
            sep_lateL_record+= 1;
          }


           //october
           //find all records in mar and is early login
           if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 9 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') > 30 && jan_record.event == 'login'){
            oct_late_record+= 1;
            
          }


          //find all records in mar and is early login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 9 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') <= 30 && jan_record.event == 'login'){
            oct_early_record+= 1;
            
          }          

          //find all records in mar and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 9 && moment(jan_record.time).get('hour') > 9 && jan_record.event == 'login'  ){
            oct_late_record+= 1;         
            
          }

          //find all records in mar and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 9 && moment(jan_record.time).get('hour') < 9 && jan_record.event == 'login'  ){
            oct_early_record+= 1;         
            
          }

          //find all records in mar and is early logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 9 && moment(jan_record.time).get('hour') < 4 && jan_record.event == 'logout'){
            console.log('')
            oct_earlyL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 9 && moment(jan_record.time).get('hour') > 5 && jan_record.event == 'logout'){
            console.log('')
            oct_lateL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 9 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') < 45 && jan_record.event == 'logout'){
            console.log('')
            oct_earlyL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 9 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') >= 45 && jan_record.event == 'logout'){
            console.log('')
            oct_lateL_record+= 1;
          }

           

           //nov
           //find all records in mar and is early login
           if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 10 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') > 30 && jan_record.event == 'login'){
            nov_late_record+= 1;
            
          }

          //find all records in mar and is early login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 10 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') <= 30 && jan_record.event == 'login'){
            nov_early_record+= 1;
            
          }    
          
          //find all records in mar and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 10 && moment(jan_record.time).get('hour') < 9 && jan_record.event == 'login'  ){
            nov_early_record+= 1;         
            
          }

          //find all records in mar and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 10 && moment(jan_record.time).get('hour') > 9 && jan_record.event == 'login'  ){
            nov_late_record+= 1;         
            
          }

          //find all records in mar and is early logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 10 && moment(jan_record.time).get('hour') < 4 && jan_record.event == 'logout'){
            console.log('')
            nov_earlyL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 10 && moment(jan_record.time).get('hour') > 5 && jan_record.event == 'logout'){
            console.log('')
            nov_lateL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 10 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') < 45 && jan_record.event == 'logout'){
            console.log('')
            nov_earlyL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 10 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') >= 45 && jan_record.event == 'logout'){
            console.log('')
            nov_lateL_record+= 1;
          }

           //december
           //find all records in mar and is early login
           if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 11 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') > 30 && jan_record.event == 'login'){
            dec_late_record+= 1;
            
          }

          //find all records in mar and is early login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 11 && moment(jan_record.time).get('hour') == 9 &&  moment(jan_record.time).get('minute') <= 30 && jan_record.event == 'login'){
            dec_early_record+= 1;
            
          }          

          //find all records in mar and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 11 && moment(jan_record.time).get('hour') > 9 && jan_record.event == 'login'  ){
            dec_late_record+= 1;         
            
          }

          //find all records in mar and is late login
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 11 && moment(jan_record.time).get('hour') < 9 && jan_record.event == 'login'  ){
            dec_early_record+= 1;         
            
          }

          //find all records in mar and is early logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 11 && moment(jan_record.time).get('hour') < 4 && jan_record.event == 'logout'){
            console.log('')
            dec_earlyL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 11 && moment(jan_record.time).get('hour') > 4 && jan_record.event == 'logout'){
            console.log('')
            dec_lateL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 11 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') < 45 && jan_record.event == 'logout'){
            console.log('')
            dec_earlyL_record+= 1;
          }

          //find all records in mar and is late logout
          if (moment(jan_record.time).get('year') == year && moment(jan_record.time).get('month') == 11 && moment(jan_record.time).get('hour') == 4 && moment(jan_record.time).get('minute') >= 45 && jan_record.event == 'logout'){
            console.log('')
            dec_lateL_record+= 1;
          }


        })

        console.log(ja_record)
       
        res.render('staff-att', {year: year, staff: staff, admin: req.session.admin, jan_record: ja_record, jan_early_login: ja_early_record, jan_late_login: ja_late_record, jan_early_logout: ja_earlyL_record, jan_late_logout: ja_lateL_record,
        fe_record: fe_record, fe_early_login: fe_early_record, fe_late_login: fe_late_record, fe_early_logout: fe_earlyL_record, fe_late_logout: fe_lateL_record,
        ma_record: ma_record, ma_early_login: ma_early_record, ma_late_login: ma_late_record, ma_early_logout: ma_earlyL_record, ma_late_logout: ma_lateL_record,
        apr_record: apr_record, apr_early_login: apr_early_record, apr_late_login: apr_late_record, apr_early_logout: apr_earlyL_record, apr_late_logout: apr_lateL_record,
        may_record: may_record, may_early_login: may_early_record, may_late_login: may_late_record, may_early_logout: may_earlyL_record, may_late_logout: may_lateL_record,
        jun_record: jun_record, jun_early_login: jun_early_record, jun_late_login: jun_late_record, jun_early_logout: jun_earlyL_record, jun_late_logout: jun_lateL_record,
        jul_record: jul_record, jul_early_login: jul_early_record, jul_late_login: jul_late_record, jul_early_logout: jul_earlyL_record, jul_late_logout: jul_lateL_record,
        aug_record: aug_record, aug_early_login: aug_early_record, aug_late_login: aug_late_record, aug_early_logout: aug_earlyL_record, aug_late_logout: aug_lateL_record,
        sep_record: sep_record, sep_early_login: sep_early_record, sep_late_login: sep_late_record, sep_early_logout: sep_earlyL_record, sep_late_logout: sep_lateL_record,
        oct_record: oct_record, oct_early_login: oct_early_record, oct_late_login: oct_late_record, oct_early_logout: oct_earlyL_record, oct_late_logout: oct_lateL_record,
        nov_record: nov_record, nov_early_login: nov_early_record, nov_late_login: nov_late_record, nov_early_logout: nov_earlyL_record, nov_late_logout: nov_lateL_record,
        dec_record: dec_record, dec_early_login: dec_early_record, dec_late_login: dec_late_record, dec_early_logout: dec_earlyL_record, dec_late_logout: dec_lateL_record,})
      })
    }
  })
  
})

mainRouter.route('/staff-att-mon').post((req, res) => {
  if(req.session.admin){
    var month = req.body.month;
    var year = req.body.year;
    var pf = req.body.staffPF;

    
    var all_mon_records = []//array to hold all mon records
    var mon_count_total = 0;

    var mon_count_1wk = 0; //from 1-7
    var mon_count_2wk = 0; //from 8-15
    var mon_count_3wk = 0; //from 16-23
    var mon_count_4wk = 0; //from 24-31

    var mon_count_1wk_early_in = 0;
    var mon_count_1wk_late_in = 0;

    var mon_count_1wk_early_out = 0;
    var mon_count_1wk_late_out = 0;

    var mon_count_2wk_early_in = 0;
    var mon_count_2wk_late_in = 0;

    var mon_count_2wk_early_out = 0;
    var mon_count_2wk_late_out = 0;

    var mon_count_3wk_early_in = 0;
    var mon_count_3wk_late_in = 0;

    var mon_count_3wk_early_out = 0;
    var mon_count_3wk_late_out = 0;

    var mon_count_4wk_early_in = 0;
    var mon_count_4wk_late_in = 0;

    var mon_count_4wk_early_out = 0;
    var mon_count_4wk_late_out = 0;

Staff.findOne({PF: pf}, (err, staff) => {


    CsvRecord.find({pf: pf}, (err, records) => {
      if(err){
        return res.send('error retrivin data: ' + err)
      }
     
      records.forEach((record, index) => {
       // console.log(moment(record.time).date())
        if(moment(record.time).get('year') == year && moment(record.time).get('month') == month){
          mon_count_total += 1          
        }

        //1st week(1-7)
        if(moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() <= 7){
          mon_count_1wk += 1          
        }
        
        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() <= 7 && moment(record.time).get('hour') == 9 &&  moment(record.time).get('minute') > 30 && record.event == 'login'){
          mon_count_1wk_late_in += 1           
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() <= 7 && moment(record.time).get('hour') == 9 &&  moment(record.time).get('minute') <= 30 && record.event == 'login'){
          mon_count_1wk_early_in += 1          
        }          

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() <= 7 && moment(record.time).get('hour') > 9 && record.event == 'login'  ){
          mon_count_1wk_late_in += 1      
         }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() <= 7 && moment(record.time).get('hour') < 9 && record.event == 'login'  ){
         mon_count_1wk_early_in         
          
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() <= 7 && moment(record.time).get('hour') < 4 && record.event == 'logout'){
         mon_count_1wk_early_out += 1
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() <= 7 && moment(record.time).get('hour') > 4 && record.event == 'logout'){
          mon_count_1wk_late_out += 1
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() <= 7 && moment(record.time).get('hour') == 4 && moment(record.time).get('minute') < 45 && record.event == 'logout'){
          mon_count_1wk_early_out += 1
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() <= 7 && moment(record.time).get('hour') == 4 && moment(record.time).get('minute') >= 45 && record.event == 'logout'){
          mon_count_1wk_late_out += 1
        }


        //2nd week(8-15)
        if(moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 8 && moment(record.time).date() <= 15){
          mon_count_2wk += 1 ;
          console.log('')         
        }

        
        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 8 && moment(record.time).date() <= 15 && moment(record.time).get('hour') == 9 &&  moment(record.time).get('minute') > 30 && record.event == 'login'){
          mon_count_2wk_late_in += 1    
            
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 8 && moment(record.time).date() <= 15 && moment(record.time).get('hour') == 9 &&  moment(record.time).get('minute') <= 30 && record.event == 'login'){
          mon_count_2wk_early_in += 1   
              
        }          

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 8 && moment(record.time).date() <= 15 && moment(record.time).get('hour') > 9 && record.event == 'login'  ){
          mon_count_2wk_late_in += 1     
           
         }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 8 && moment(record.time).date() <= 15 && moment(record.time).get('hour') < 9 && record.event == 'login'  ){
         mon_count_2wk_early_in  += 1
               
          
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 8 && moment(record.time).date() <= 15 && moment(record.time).get('hour') < 4 && record.event == 'logout'){
         mon_count_2wk_early_out += 1
         
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 8 && moment(record.time).date() <= 15 && moment(record.time).get('hour') > 4 && record.event == 'logout'){
          mon_count_2wk_late_out += 1
          
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 8 && moment(record.time).date() <= 15 && moment(record.time).get('hour') == 4 && moment(record.time).get('minute') < 45 && record.event == 'logout'){
          mon_count_2wk_early_out += 1
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 8 && moment(record.time).date() <= 15 && moment(record.time).get('hour') == 4 && moment(record.time).get('minute') >= 45 && record.event == 'logout'){
          mon_count_2wk_late_out += 1
          
        }


        //3nd week(16-23)
        if(moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 16 && moment(record.time).date() <= 23){
          mon_count_3wk += 1          
        }

                
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 16 && moment(record.time).date() <= 23 && moment(record.time).get('hour') == 9 &&  moment(record.time).get('minute') > 30 && record.event == 'login'){
          mon_count_3wk_late_in += 1           
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 16 && moment(record.time).date() <= 23 && moment(record.time).get('hour') == 9 &&  moment(record.time).get('minute') <= 30 && record.event == 'login'){
          mon_count_3wk_early_in += 1          
        }          

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 16 && moment(record.time).date() <= 23 && moment(record.time).get('hour') > 9 && record.event == 'login'  ){
          mon_count_3wk_late_in += 1      
         }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 16 && moment(record.time).date() <= 23 && moment(record.time).get('hour') < 9 && record.event == 'login'  ){
         mon_count_3wk_early_in += 1        
          
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 16 && moment(record.time).date() <= 23 && moment(record.time).get('hour') < 4 && record.event == 'logout'){
         mon_count_3wk_early_out += 1
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 16 && moment(record.time).date() <= 23 && moment(record.time).get('hour') > 4 && record.event == 'logout'){
          mon_count_3wk_late_out += 1
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 16 && moment(record.time).date() <= 23 && moment(record.time).get('hour') == 4 && moment(jan_record.time).get('minute') < 45 && record.event == 'logout'){
          mon_count_3wk_early_out += 1
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 16 && moment(record.time).date() <= 23 && moment(record.time).get('hour') == 4 && moment(record.time).get('minute') >= 45 && record.event == 'logout'){
          mon_count_3wk_late_out += 1
        }


        //4nd week(24-31)
        if(moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 24 && moment(record.time).date() <= 31){
          mon_count_4wk += 1          
        }

                
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 24 && moment(record.time).date() <= 31 && moment(record.time).get('hour') == 9 &&  moment(record.time).get('minute') > 30 && record.event == 'login'){
          mon_count_4wk_late_in += 1           
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 24 && moment(record.time).date() <= 31 && moment(record.time).get('hour') == 9 &&  moment(record.time).get('minute') <= 30 && record.event == 'login'){
          mon_count_4wk_early_in += 1          
        }          

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 24 && moment(record.time).date() <= 31 && moment(record.time).get('hour') > 9 && record.event == 'login'  ){
          mon_count_4wk_late_in += 1      
         }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 24 && moment(record.time).date() <= 31 && moment(record.time).get('hour') < 9 && record.event == 'login'  ){
         mon_count_4wk_early_in += 1        
          
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 24 && moment(record.time).date() <= 31 && moment(record.time).get('hour') < 4 && record.event == 'logout'){
         mon_count_4wk_early_out += 1
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 24 && moment(record.time).date() <= 31 && moment(record.time).get('hour') > 4 && record.event == 'logout'){
          mon_count_4wk_late_out += 1
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 24 && moment(record.time).date() <= 31 && moment(record.time).get('hour') == 4 && moment(jan_record.time).get('minute') < 45 && record.event == 'logout'){
          mon_count_4wk_early_out += 1
        }

        
        if (moment(record.time).get('year') == year && moment(record.time).get('month') == month && moment(record.time).date() >= 24 && moment(record.time).date() <= 31 && moment(record.time).get('hour') == 4 && moment(record.time).get('minute') >= 45 && record.event == 'logout'){
          mon_count_4wk_late_out += 1
        }
        
      })

      console.log(mon_count_1wk)

      res.render('monattend', {month: month, year: year, staff: staff, count: mon_count_total, admin: req.session.admin, month: month, moment: moment,
        mon_count_1wk: mon_count_1wk, mon_count_1wk_early_in: mon_count_1wk_early_in, mon_count_1wk_early_out: mon_count_1wk_early_out, mon_count_1wk_late_in: mon_count_1wk_late_in, mon_count_1wk_late_out: mon_count_1wk_late_out,
        mon_count_2wk: mon_count_2wk, mon_count_2wk_early_in: mon_count_2wk_early_in, mon_count_2wk_early_out: mon_count_2wk_early_out, mon_count_2wk_late_in: mon_count_2wk_late_in, mon_count_2wk_late_out: mon_count_2wk_late_out,
        mon_count_3wk: mon_count_3wk, mon_count_3wk_early_in: mon_count_3wk_early_in, mon_count_3wk_early_out: mon_count_3wk_early_out, mon_count_3wk_late_in: mon_count_3wk_late_in, mon_count_3wk_late_out: mon_count_3wk_late_out,
        mon_count_4wk: mon_count_4wk, mon_count_4wk_early_in: mon_count_4wk_early_in, mon_count_4wk_early_out: mon_count_4wk_early_out, mon_count_4wk_late_in: mon_count_4wk_late_in, mon_count_4wk_late_out: mon_count_4wk_late_out })
      

    })
  })

  }else{
    res.render('adminpin', {admin: req.session.admin})
  }

})


mainRouter.route('/staff-att-ran').post((req, res) => {
  if(req.session.admin){
    var from = req.body.from;
    var to = req.body.to;
    var pf = req.body.staffPF;

    var count_total = 0;
    var ran_early_in = 0;
    var ran_early_out = 0;
    var ran_late_in = 0;
    var ran_late_out = 0;

    CsvRecord.find({pf: pf, time: {$gte: from, $lt: to}}, (err, records)=> {
      if(err){
        return res.send(err)
      }
      console.log(records.length)

      records.forEach((record, index) => {
     

        count_total += 1;
            
        if (moment(record.time).get('hour') == 9 &&  moment(record.time).get('minute') > 30 && record.event == 'login'){
            ran_early_in += 1           
        }
    
        
        if (moment(record.time).get('hour') == 9 &&  moment(record.time).get('minute') <= 30 && record.event == 'login'){
            ran_early_in += 1          
        }          
    
        
        if (moment(record.time).get('hour') > 9 && record.event == 'login'  ){
          ran_late_in += 1      
         }
    
        
        if (moment(record.time).get('hour') < 9 && record.event == 'login'  ){
         ran_early_in += 1        
          
        }
    
        
        if (moment(record.time).get('hour') < 4 && record.event == 'logout'){
         ran_early_out += 1
        }
    
        
        if (moment(record.time).get('hour') > 4 && record.event == 'logout'){
          ran_late_out += 1
        }
    
        
        if (moment(record.time).get('hour') == 4 && moment(record.time).get('minute') < 45 && record.event == 'logout'){
          ran_early_out += 1
        }
    
        
        if (moment(record.time).get('hour') == 4 && moment(record.time).get('minute') >= 45 && record.event == 'logout'){
          ran_late_out += 1
        }
    
    
        
      })

    
      res.render('ranattend', {count: count_total, admin: req.session.admin, moment: moment, from: from, to: to,
        ran_early_in: ran_early_in, ran_early_out: ran_early_out, ran_late_in: ran_late_in, ran_late_out: ran_late_out,
        })
      
    
          
    })

    
  }else{
    res.render('adminpin', {admin: req.session.admin})
  }
})

mainRouter.route('/see-chart').get((req, res) => {
  var logins = 0;
  var logouts = 0;

  CsvRecord.countDocuments({event: 'login'}, (err, numi) => {
    logins = numi;
  })
  CsvRecord.countDocuments({event: 'logout'}, (err, numo) => {
    logouts = numo;
  })

  res.render('chartview', {logins: logins, logouts: logouts})

})

mainRouter.route('/check-admin').get(function (req, res) {
  console.log(44)
  if(req.session.admin){
    if(req.session.admin.role == 3 || req.session.admin.role == 4 || req.session.admin.role == 5){
      return res.render('createadmin', {admin: req.session.admin, status: ''})
    }else{
      return res.render('checkadmin', {admin: req.session.admin, status: 'forget it, you do not have admin priviledges for these operation'})
    }
  }else{
    return res.render('checkadmin', {admin: req.session.admin, status: ''})
  }

   
})

mainRouter.route('/check-admin').post(function (req, res) {
  var password = req.body.password;
  console.log(55)
  
  Admin.findOne({password:password},(err, admin) => {
    if (err){
      return res.send(err) 
    }

    

    if(admin.role == 3 || admin.role == 4 || admin.role == 5){
      req.session.admin = admin
      return res.render('createadmin', {admin: req.session.admin, status: ''})
    }else{
      return res.render('checkadmin', {admin: req.session.admin, status: 'forget it, you do not have admin priviledges for these operation'})
    }

    //return res.render('createadmin', {admin: req.session.admin, status: ''})
  })
})

mainRouter.route('/front').get(function (req, res) {
  var num = 0;
  Staff.countDocuments((err, number) => {
    if(err){
      return res.send('error' + err)
    }else{
      num = number;
      
      return res.json(num)

    }
  })
})

mainRouter.route('/frontL').get(function (req, res) {
  var num = 0;
  
  Leave.find((err, leaves) => {
    if(err){
      return res.send(err)
    }

    for (leave of leaves){
      if(moment().isBetween(leave.leave_start_date, leave.leave_end_date)){
       num += 1
      }
    }
    
    return res.json(num)
  })

})

module.exports = mainRouter;