# JRG commentary

## The Task

Modify the api so it will scale up to 1M users per minute

## The Approach

I have 2 goals in this:

1. Ask the code to do what is necessary and nothing more.
2. Leverage the framework's performance tools as much as possible.

## Main changes

  * Change the main usages call to no longer push everything to the same array.  We want each call to be independent to avoid having to wait on flushing a large array.

  ...* In the example, we're using the file system to represent a call to a database API

  ...* The version represented here sends the response in the API callback.  This seems like a more realistic use case.

  ...* There is an alternative version (commented) where we instead dump the payload straight into a write buffer.  The idea behind this would be that another process is looking for those files and eventually processing them to their final destination.  This is potentially even faster, as it minimizes the work we're asking our web server to do/wait on, but we lose the ability to respond to the user with information from the database so it is possible this wouldn't be a viable option.

  * Implement expresses' [best practice recommendations](https://expressjs.com/en/advanced/best-practice-performance.html)

  ...* Compress response Content

  ...* Avoid synchronous calls (in this case, buffering the console)

  ...* Introduce try/catch blocks around potentially error conditions

  * Implement clustering to allow multiple worker threads

---
Begin original readme

# busyapi

A sample API server for use as an optimization subject.

## Setup

  *  Clone this repository
  *  Install dependencies `npm install`
  *  Start the server `npm start`
  *  Go to [http://localhost:3000/](http://localhost:3000/) to confirm the server is running

## API

The API consists of a single endpoint which receives data when a patient uses their inhaler.

### Add Usage

  *  **method**: POST
  *  **endpoint**: /api/usages
  *  **data**: JSON usage object
  *  **result**: JSON object containing the usageId, HTTP Status 201, 200, 500

#### Example

**Data**
````
{
    "patientId":100,
    "timestamp":"Tue Nov 01 2016 09:11:51 GMT-0500 (CDT)",
    "medication":"Albuterol",
}
````

**Request**

     curl -X POST -H "Content-Type: application/json" --data '{"patientId":"100","timestamp":"Tue Nov 01 2016 09:11:51 GMT-0500 (CDT)","medication":"Albuterol"}' http://localhost:3000/api/usages

**Response**
````
{
    "id":22954
}
````
