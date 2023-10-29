# Issue Tracker - User Documentation
### Overview:
- [Introduction](#introduction)
- [Api End Points](#api-end-points)
- [Visit Site](https://obn-issue-tracker-microsrvice.onrender.com/)

## Introduction
This Issue Tracker Microservice is the perfect option for easily managing and tracking issues. This feature-rich tool enables you to easily create, examine, change, and eliminate issues inside your projects. Our microservice, which includes a variety of functional tests, guarantees that you can easily manage all aspects of your difficulties. Send a POST request with all of the relevant parameters, and you'll get the generated object with timestamps and an issue ID. The GET request allows you to browse issues in a project and add filters to reduce your search. PUT requests are used to update problem data, whereas eliminate requests are used to quickly eliminate issues. With a robust set of features, this Issue Tracker Microservice streamlines issue management, making it a breeze to keep your projects on track.

![image](https://github.com/obedNuertey1/issue_tracker_fullStack_project/assets/101027384/477e9649-7879-4afe-be3b-9df324743d86)

## Api End Points
* You can send a **POST** request to `/api/issues/{projectname}` with form data containing the required fields issue_title, issue_text, created_by, and optionally assigned_to and status_text.
* The **POST** request to `/api/issues/{projectname}` will return the created object, and must include all of the submitted fields. Excluded optional fields will be returned as empty strings. Additionally, include created_on (date/time), updated_on (date/time), open (boolean, true for open - default value, false for closed), and _id.
* If you send a **POST** request to `/api/issues/{projectname}` without the required fields, returned will be the error `{ error: 'required field(s) missing' }`
* You can send a **GET** request to `/api/issues/{projectname}` for an array of all issues for that specific projectname, with all the fields present for each issue.
* You can send a **GET** request to `/api/issues/{projectname}` and filter the request by also passing along any field and value as a URL query (ie. /api/issues/{project}?open=false). You can pass one or more field/value pairs at once.
* You can send a **PUT** request to `/api/issues/{projectname}` with an _id and one or more fields to update. On success, the updated_on field should be updated, and returned should be `{  result: 'successfully updated', '_id': _id }`.
* When the **PUT** request sent to `/api/issues/{projectname}` does not include an _id, the return value is `{ error: 'missing _id' }`.
* When the **PUT** request sent to `/api/issues/{projectname}` does not include update fields, the return value is `{ error: 'no update field(s) sent', '_id': _id }`. On any other error, the return value is `{ error: 'could not update', '_id': _id }`.
* You can send a **DELETE** request to `/api/issues/{projectname}` with an _id to delete an issue. If no _id is sent, the return value is `{ error: 'missing _id' }`. On success, the return value is `{ result: 'successfully deleted', '_id': _id }`. On failure, the return value is `{ error: 'could not delete', '_id': _id }`.
