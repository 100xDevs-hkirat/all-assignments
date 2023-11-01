
### Create the frontend for the ADMIN DASHBOARD for a course selling app

Please start backend from week-3/solutions/03-course-app-medium.js (add app.listen, cors if its not there already)

1. Start the backend from week-3/solutions/02-course-app-medium.js
2. We will use authentication, which means you need to get back the jwt and store it in localStorage (read https://www.robinwieruch.de/local-storage-react/)
3. You need to understand routing for this to work, so we've added a basic boilerplate that lets you navigate between 3 routes (check App.jsx)
4. To test the current app, run `npm run dev` and see the output on localhost:3000

Things that will confuse you - 
1. Routing. Here is a great blog post explaining it - https://hygraph.com/blog/routing-in-react . If you open App.jsx you should intuitively be able to understand whats happening
2. Authentication (More specifically , how to store it in localstorage and how to put it in headers when sending the request)

### Hard todo - 
Add routing to introduce a new route /courses/:id which shows you the contents of a single course
It should also let you edit the course title, description and price
This will be needed in the next assignment