'use strict';

const mongoose = require("mongoose");
const { Project, Issue } = require('../models/models.js');


// const { ObjectId } = require('mongodb').ObjectID;
const ObjectID = mongoose.Types.ObjectId;


module.exports = function(app) {

  app.route('/api/issues/:project')

    .get(function(req, res) {
      let project = req.params.project;

      let { created_on, updated_on, open, _id, issue_title, issue_text, created_by, assigned_to, status_text } = req.query;

      // open = Boolean(open);
      if(open === 'true' || open === 'false'){
        if(open === 'true'){
          open = true;
        }else{
          open = false;
        }
      }
      // make a query to the database with findOne and chain select({issues: 1}) and chai exec
      Project.aggregate([
        { $match: { name: project } },
        { $unwind: "$issues" },
        (created_on) ? { $match: { "issues.created_on": new Date(Date.parse(created_on)) } } : { $match: {} },
        (updated_on) ? { $match: { "issues.updated_on": new Date(Date.parse(updated_on))} } : { $match: {} },
        (open != undefined) ? { $match: { "issues.open": open } } : { $match: {} },
        (_id) ? { $match: { "issues._id": ObjectID(_id) } } : { $match: {} },
        (issue_title) ? { $match: { "issues.issue_title": issue_title } } : { $match: {} },
        (issue_text) ? { $match: { "issues.issue_text": issue_text } } : { $match: {} },
        (created_by) ? { $match: { "issues.created_by": created_by } } : { $match: {} },
        (assigned_to) ? { $match: { "issues.assigned_to": assigned_to } } : { $match: {} },
        (status_text) ? { $match: { "issues.status_text": status_text } } : { $match: {} }
      ], (err, doc) => {
        if (err) {
          return res.json([]);
        } else {
          let newRefinedIssues = doc.map((elem) => {
            return elem.issues;
          });
          return res.json(newRefinedIssues);
          // res.json(doc);
        }
      });
    })

    .post(function(req, res) {
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      // if issue_title, issue_text or created_by are empty respont with a json and return
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: "required field(s) missing" });
      }

      const myIssues = new Issue({
        issue_title: issue_title || "",
        issue_text: issue_text || "",
        created_by: created_by || "",
        assigned_to: assigned_to || "",
        open: true,
        status_text: status_text || ""
      });

      // database implementation
      // Check whether a project is in the database with findOne
      Project.findOne({ name: project }, (err, proj) => {
        if (err) {
          res.send("There was an error saving in post");
        } else if (!proj) {// if the project is not in the database
          // create the project with only the project name with the project model
          const myProj = new Project({ name: project });
          // and push the issues to the new project
          myProj.issues.push(myIssues);
          myProj.save((err, doc) => {
            if (err) {
              res.send("There was an error saving in post");
            } else {
              res.json(myIssues);
            }
          });
        } else {
          proj.issues.push(myIssues);
          proj.save((err, doc) => {
            if (err) {
              res.send("There was an error saving in post");
            } else {
              res.json(myIssues);
            }
          });
        }

      });
    })

    // .put(function (req, res){
    //   let project = req.params.project;

    //   let {
    //     _id,
    //     issue_title,
    //     issue_text,
    //     created_by,
    //     assigned_to,
    //     open,
    //     status_text,
    //   } = req.body;

    //   if (!_id) {
    //     return res.json({ error: "missing _id" });
    //   }

    //   if (
    //     !issue_title &&
    //     !issue_text &&
    //     !created_by &&
    //     !assigned_to &&
    //     !open &&
    //     !status_text
    //   ) {
    //     return res.json({ error: "no update field(s) sent", _id: _id });
    //   }

    //   Project.findOne({ name: project }, (err, proj) => {
    //     if (err || !proj ) {
    //       return res.json({ error: "could not update", _id: _id });
    //     } else {
    //       // let issueData = projectData.issues.id(_id);
    //       // if (!issueData) {
    //       //   return res.json({ error: "could not update", _id: _id });
    //       // }
    //       // issueData.issue_title = issue_title || issueData.issue_title;
    //       // issueData.issue_text = issue_text || issueData.issue_text;
    //       // issueData.created_by = created_by || issueData.created_by;
    //       // issueData.assigned_to = assigned_to || issueData.assigned_to;
    //       // issueData.status_text = status_text || issueData.status_text;
    //       // issueData.updated_on = new Date().toUTCString();
    //       // issueData.open = open;
    //       if(proj.issues.some(elem => (elem._id != _id))){
    //             return res.json({error: 'could not update', _id: _id});
    //         }
    //       let updated_issues = proj.issues.map(elem=>{
    //         let issueVals = {
    //           created_on: elem.created_on,
    //           updated_on: new Date().toUTCString(),
    //           open: (open===false)?open:elem.open,
    //           _id: elem._id,
    //           issue_title: issue_title || elem.issue_title,
    //           issue_text: issue_text || elem.issue_text,
    //           created_by: created_by || elem.created_by,
    //           assigned_to: assigned_to || elem.assigned_to,
    //           status_text: status_text || elem.status_text
    //         };
    //         if(elem._id == _id){
    //           elem = issueVals;
    //         }
    //         return elem;
    //       });
    //       proj.issues = updated_issues;
    //       proj.save((err, data) => {
    //         if (err || !data ) {
    //           return res.json({ error: "could not update", _id: _id });
    //         } else {
    //           return res.json({ result: "successfully updated", _id: _id });
    //         }
    //       })
    //     }
    //   })
    // })

    .put(function(req, res) {
      let project = req.params.project;

      let updated = {state: false};
      
      let {_id, issue_title, issue_text, created_by, assigned_to, status_text, open} = req.body;

      if(_id === undefined){
        return res.json({error: 'missing _id'});
      }

      if(!issue_title && !issue_text && !created_by && !assigned_to && !status_text && open == undefined){
        return res.json({ error: 'no update field(s) sent', _id: _id });
      }
      
      if(open === 'false'){
        open = false;
      }
      // make a query to the database with findOne to check whether the name is in the database
      // within the documents that is returned
      // We use map function assigned to a variable updated_issues and an if statement to check if the id gotten from the req.body is equal to a particular element returned within the map function and update those elements accordingly
      // we then make the doc.issues property = updated_issues 
      // and use doc.save property
      // res with {error: 'could not update', '_id': _id} if there was an error
      // else res with {result: 'successfully updated', '_id':_id}
      
      Project.findOne({name: project}, (err, proj)=>{
        if(err || !proj){
          res.json({ error: 'could not update', _id: _id });
        }else{
          let issueData = proj.issues.id(_id);
          if (!issueData) {
            return res.json({ error: "could not update", _id: _id });
          }
          issueData.issue_title = issue_title || issueData.issue_title;
          issueData.issue_text = issue_text || issueData.issue_text;
          issueData.created_by = created_by || issueData.created_by;
          issueData.assigned_to = assigned_to || issueData.assigned_to;
          issueData.status_text = status_text || issueData.status_text;
          issueData.updated_on = new Date().toUTCString();
          issueData.open = open;
        
          proj.save((err, doc)=>{
            if(err || !doc){
              return res.json({ error: 'could not update', _id: _id })
            }      
            return res.json({result: 'successfully updated', _id: _id})
          });
        }
      });
      
      if(updated.state){
        updated.state = false;
        return res.json({result: 'successfully updated', _id: _id});
      }
      
    })

    .delete(function(req, res) {
      let project = req.params.project;
      const {_id} = req.body;
      if(!_id){
        return res.json({error: 'missing _id'});
      }
      
      Project.findOne({name: project}, (err, proj)=>{
        if(err){
          res.json({error: 'could not delete', '_id':_id});
        }else{
          let modifiedIssuesArray = [];
          
          if(proj.issues.some(elem=>(elem._id == _id))){
            modifiedIssuesArray.push(...proj.issues.filter((elem)=>(elem._id != _id)));
          }else{
            return res.json({error: 'could not delete', '_id':_id})
          }
          
          proj.issues = modifiedIssuesArray;
          
          if(!proj.issues.some(elem=>(elem._id == _id))){
            proj.save((err, doc)=>{
              if(err){
                res.json({error: 'could not delete', '_id': _id})
              }else{
                res.json({result: 'successfully deleted', '_id': _id})
              }
            });
          }else{
            res.json({error: 'could not delete', '_id': _id});
          }
        }
      });
    });

};
