const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  issue_title: {
    type: String,
    required: true
  },
  issue_text: {
    type: String,
    required: true
  },
  created_on: {
    type: Date,
    default: new Date()
  },
  updated_on: {
    type: Date,
    default: new Date()
  },
  created_by: {
    type: String,
    required: true
  },
  assigned_to: {
    type: String
  },
  open: {
    type: Boolean,
    default: false
  },
  status_text: {
    type: String
  }
});

const Issue = mongoose.model("Issue", issueSchema);

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  issues: [issueSchema]
});

const Project = mongoose.model("Project", projectSchema);

// const { Schema } = mongoose;

// const IssueSchema = new Schema({
//   issue_title: { type: String, required: true },
//   issue_text: { type: String, required: true },
//   created_on: Date,
//   updated_on: Date,
//   created_by: { type: String, required: true },
//   assigned_to: String,
//   open: Boolean,
//   status_text: String,
// });
// const Issue = mongoose.model("Issue", IssueSchema);

// const ProjectSchema = new Schema({
//   name: { type: String, required: true },
//   issues: [IssueSchema],
// })
// const Project = mongoose.model("Project", ProjectSchema);

module.exports = {
  Issue,
  Project
};