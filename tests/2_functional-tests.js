const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const mongoose = require("mongoose");
const ObjectID = mongoose.Types.ObjectId;

chai.use(chaiHttp);

let testId = '';

suite('Functional Tests', function() {
  
  suite('post requests', function(){
    
    test('Create an issue with every field: POST request to /api/issues/{project}', function(done){
      chai
      .request(server)
      .keepOpen()
      .post('/api/issues/lemon')
      .set('content-type', 'application/json')
      .send({
        "issue_title": "Issue one",
        "issue_text": "text 1",
        "created_by": "Joe",
        "assigned_to": "Jimmy",
        "open": true,
        "status_text": "cooking"
      }).end((err, res)=>{
        testId = res.body['_id'];
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body['issue_title'], 'Issue one');
        assert.equal(res.body['created_by'], 'Joe');
        assert.equal(res.body['assigned_to'], 'Jimmy');
        assert.isOk(res.body['open']);
        done();
      });
    });

    test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done){
      chai.
        request(server)
        .keepOpen()
        .post('/api/issues/lemon2')
        .set('content-type', 'application/json')
        .send({
          "issue_title": "Issue one",
          "issue_text": "text 2",
          "created_by": "Jimmy2"
        }).end((err, res)=>{
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body['assigned_to'], '');
          assert.isOk(res.body['open']);
          assert.equal(res.body['issue_title'], 'Issue one');
          assert.equal(res.body['issue_text'], 'text 2')
          done();
        });
    });

    test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done){
      chai
        .request(server)
        .keepOpen()
        .post('/api/issues/lemon3')
        .set('content-type', 'application/json')
        .send({
          issue_title: '',
          issue_text: '',
          created_by: ''
        })
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body['error'], 'required field(s) missing');
          done();
        });
    });
    
  });

  suite('get requests', function(){

    test('View issues on a project: GET request to /api/issues/{project}', function(done){
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/lemon')
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body[0]['issue_title'], 'Issue one');
          assert.isOk(res.body[0]['open']);
          done();
        })
    });

    test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done){
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/lemon?open=true')
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isArray(res.body);
          // assert.isOk(res.body[0]['open']);
          done();
        });
    });

    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done){
      chai
        .request(server)
        .keepOpen()
        .get('/api/issues/lemon?open=true&assigned_to=Jimmy&status_text=cooking')
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.isArray(res.body);
          done();
        });
    });

    
  });

  suite('put requests', function(){

    test('Update one field on an issue: PUT request to /api/issues/{project}', function(done){
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/lemon')
        .set('content-type', 'application/json')
        .send({
          '_id': testId,
          "issue_title": "Issue one",
        })
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body['result'], 'successfully updated');
          done();
        });
    });
    
    
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done){
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/lemon')
        .set('content-type', 'application/json')
        .send({
          '_id': testId,
          "issue_title": "Issue one",
          "issue_text": "textBook 1",
          "created_by": "Joe's Brother",
          "assigned_to": "Jimmy",
          "open": false,
          "status_text": "not cooking"
        })
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body['result'], 'successfully updated');
          done();
        });
    });
    
    test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done){
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/lemon')
        .set('content-type', 'application/json')
        .send({
          "issue_title": "Issue one",
          "issue_text": "textBook 1",
          "created_by": "Joe's Brother",
          "assigned_to": "Jimmy",
          "open": false,
          "status_text": "not cooking"
        })
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body['error'], 'missing _id');
          done();
        });
    });

    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done){
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/lemon')
        .set('content-type', 'application/json')
        .send({
           '_id': testId,
          "issue_title": "",
          "issue_text": "",
          "created_by": "",
          "assigned_to": "",
          "status_text": ""
        }).end((err, res)=>{
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body['error'], 'no update field(s) sent');
          done();
        });
    });
    
    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done){
      chai
        .request(server)
        .keepOpen()
        .put('/api/issues/lemon')
        .set('content-type', 'application/json')
        .send({
          "_id": "invalid_id",
          "issue_title": "Issue one",
          "issue_text": "textBook 1",
          "created_by": "Joe's Brother",
          "assigned_to": "Jimmy",
          "open": false,
          "status_text": "not cooking"
        })
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body['error'], 'could not update');
          assert.equal(res.body['_id'], 'invalid_id');
          done();
        });
    });
    
  });

  suite('delete requests', function(){

    test('Delete an issue: DELETE request to /api/issues/{project}', function(done){
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/lemon')
        .set('content-type', 'application/json')
        .send({"_id": testId})
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body['result'], 'successfully deleted');
          assert.equal(res.body['_id'], testId);
          done();
        });
    });
    
    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done){
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/lemon')
        .set('content-type', 'application/json')
        .send({"_id": 'invalid_id'})
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body['error'], 'could not delete');
          done();
        });
    });
    
    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done){
      chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/lemon')
        .set('content-type', 'application/json')
        .send({"_id": ''})
        .end((err, res)=>{
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.equal(res.body['error'], 'missing _id');
          done();
        });
    });
    
  })
  
});
