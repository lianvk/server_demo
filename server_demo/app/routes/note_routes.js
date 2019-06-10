var ObjectID = require('mongodb').ObjectID;
module.exports = function(app, db) {

 //__________________________________________


 app.get('/metka/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('metka').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      } 
    });
  });

app.get("/metka", function(req, res){
        
    const collection = db.collection("metka");
    collection.find({}).toArray(function(err, metka){
         
        if(err) return console.log(err);
        res.send(metka)
        console.log('metka' + metka);
    });
     
});


app.post('/metka', (req, res) => {
	// var numb = 1;
	const metkalon = req.body.lon;
	const metkalat = req.body.lat;
	const title = req.body.comment;
	const nummar = req.body.nummar;
	const balans = req.body.balans;
	const tip = req.body.tip;
	const ich = req.body.ich;

    const metk = {lon: metkalon, lat: metkalat, title: title, nummar: nummar, balans: balans, tip: tip, ich: ich };
    // const metk = {lon: metkalon, lat: metkalat, title: title, nummar: nummar, balans:balans};


    console.log('coor:' + nummar);

    db.collection('metka').insertOne(metk, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        res.send(result.ops[0]);
      }
    });
  });


app.delete('/metka/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('metka').remove(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('metka ' + id + ' deleted!');
      } 
    });
  });


 app.put ('/metka/:id', (req, res) => {
    const id = req.params.id;
    // const title = req.body.comment;
	const nummar = req.body.nummar;
	const balans = req.body.balans;
	const tip = req.body.tip;
	const ich = req.body.ich;
    const details = { '_id': new ObjectID(id) };
    console.log('tip:' + tip);
    console.log('id:' + id);
    const metk = {nummar: nummar, balans: balans, tip: tip, ich: ich };
    db.collection('metka').update(details, {$set: metk}, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
      } else {
          res.send(metk);
      } 
    });
  });

 app.put ('/metka/edit/:id', (req, res) => {
    const id = req.params.id;

	const metkalon = req.body.lon;
	const metkalat = req.body.lat;
    const details = { '_id': new ObjectID(id) };
    // console.log('lon:' + tip);
    console.log('id:' + id);
    const metk = {lon: metkalon, lat: metkalat};
    db.collection('metka').update(details, {$set: metk}, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
      } else {
          res.send(metk);
      } 
    });
  });

 //-----------------------------------------------------------------

 app.get('/segment/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('segment').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      } 
    });
  });



 app.get("/segment", function(req, res){
        
    const collection = db.collection("segment");
    collection.find({}).toArray(function(err, segment){
         
        if(err) return console.log(err);
        res.send(segment)
        console.log('seg' + segment);
    });
     
});



 app.post('/segment', (req, res) => {
	// var numb = 1;
	const title = req.body.title;
	const coor = req.body.coor;
	const nummar = req.body.nummar_seg;
	const balans = req.body.balans_seg;
	const tip = req.body.tip_seg;
	const mat = req.body.mat_seg;
	const diam = req.body.d_seg;
	const ich = req.body.ich_seg;

    const seg = {title: title, coor: coor , nummar: nummar, balans: balans,tip:tip, mat: mat,diam:diam, ich: ich };
    // const metk = {lon: metkalon, lat: metkalat, title: title, nummar: nummar, balans:balans};


    console.log('coor:' + coor);

    db.collection('segment').insertOne(seg, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        res.send(result.ops[0]);
      }
    });
  });

 app.delete('/segment/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('segment').remove(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('segment ' + id + ' deleted!');
      } 
    });
  });

 app.put ('/segment/:id', (req, res) => {
    const id = req.params.id;
    // const title = req.body.comment;
	const nummar = req.body.nummar;
	const balans = req.body.balans;
	const tip = req.body.tip;
	const mat = req.body.mat;
	const diam = req.body.diam;
	const ich = req.body.ich;
    const details = { '_id': new ObjectID(id) };
    console.log('mat:' + tip);
    console.log('id:' + id);
    const seg = {nummar: nummar, balans: balans,tip:tip, mat: mat,diam: diam, ich: ich };
    db.collection('segment').update(details, {$set: seg}, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
      } else {
          res.send(seg);
      } 
    });
  });

  app.put ('/segment/edit/:id', (req, res) => {
    const id = req.params.id;

	const coor = req.body.cord;
	// const metkalat = req.body.lat;
    const details = { '_id': new ObjectID(id) };
    // console.log('lon:' + tip);
    console.log('id:' + id);
    const seg = {coor: coor};
    db.collection('segment').update(details, {$set: seg}, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
      } else {
          res.send(seg);
      } 
    });
  });
//--------------------------------------------------------------------------------


app.post('/rp', (req, res) => {
	// var numb = 1;
	const title = req.body.title;
	const coor = req.body.coor;
	const nummar = req.body.nummar_rp;
	const balans = req.body.balans_rp;
	const tip = req.body.tip_rp;
	const ich = req.body.ich_rp;

    const rp1 = {title: title, coor: coor , nummar: nummar, balans: balans,tip:tip, ich: ich };
    // const metk = {lon: metkalon, lat: metkalat, title: title, nummar: nummar, balans:balans};


    console.log('coor:' + coor);

    db.collection('rp').insertOne(rp1, (err, result) => {
      if (err) { 
        res.send({ 'error': 'An error has occurred' }); 
      } else {
        res.send(result.ops[0]);
      }
    });
  });

app.get("/rp", function(req, res){
        
    const collection = db.collection("rp");
    collection.find({}).toArray(function(err, rp){
         
        if(err) return console.log(err);
        res.send(rp)
        console.log('rp' + rp);
    });
     
});

app.get('/rp/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('rp').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(item);
      } 
    });
  });


app.delete('/rp/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('rp').remove(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('rp ' + id + ' deleted!');
      } 
    });
  });

 app.put ('/rp/:id', (req, res) => {
    const id = req.params.id;
    // const title = req.body.comment;
	const nummar = req.body.nummar;
	const balans = req.body.balans;
	const tip = req.body.tip;
	const ich = req.body.ich;
    const details = { '_id': new ObjectID(id) };
 
    console.log('id:' + id);
    const rp1 = {nummar: nummar, balans: balans,tip:tip, ich: ich };
    db.collection('rp').update(details, {$set: rp1}, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
      } else {
          res.send(rp1);
      } 
    });
  });

  app.put ('/rp/edit/:id', (req, res) => {
    const id = req.params.id;
 
	const coor = req.body.cord;
	// const metkalat = req.body.lat;
    const details = { '_id': new ObjectID(id) };
    // console.log('lon:' + tip);
    console.log('id:' + id);
    const rp1 = {coor: coor};
    db.collection('rp').update(details, {$set: rp1}, (err, result) => {
      if (err) {
          res.send({'error':'An error has occurred'});
      } else {
          res.send(rp1);
      } 
    });
  });


 };