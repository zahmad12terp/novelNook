# Developer Manual
### Installation of NovelNook Application
<!--Come back and link the finished vercel app here-->
Completed web application is linked [here]().
<br>
To install the application for further development purposes, it's files are all hosted on this Github link found [here](https://github.com/zahmad12terp/novelNook). 
<br><br>
Note for the Grading Team: The development team originally worked on [this repository](https://github.com/sssmira/377). Which explains why there are less contributions in the final Github repository, we needed to switch repos for purposes relating to hosting on Vercel. 
<br><br>
Clone the Github repository to your workspace to edit, we developed using VScode but other code editors may work as well. To run the application for viewing while editing, we opened the HTML files using our web browser (Chrome), similar web browsers may be used. Additionally, for the front-end we used NodeJS, which required a 
download for npm linked [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
<br><br>
All of our web pages files are found in the 'public' sub-folder. <br>
 All of our NodeJS related modules are found in the 'node_modules' sub-folder (This folder can be ignored for editing purposes for the most part). <br>
 The '.vscode' sub-folder has a json file for the live server which isn't necessary in editing the web app. <br>
 Outside of the sub-folders, in the main NovelNook folder are a few JavaScript and JSON files for packages and backend code.

### How to Run Application on a Server
To start the server , we need to include an index file with server up address port defined. Then in terminal enter command “npm start”.

### Testing
We did not have any formal unit testing of code. All code testing was done by refreshing the page after edits were made and viewing the results. 

### API for Server Application - all GET, POST, PATCH, etc endpoints, and what they each do
Using index.js we handle the backend server connection to SupaBase backend. 
* GET: Retreieves books from database to fill the user's liked books data table page. 
* POST: Posts new users to SupaBase when they use the signup functionality. Then posts login information to the backend when successfully signed up/logged in. Liking books from explore page posts the liked book data to SupaBase.
* PATCH: N/A
* DELETE: Deletes book from liked book datatable.
 ## Summary of GET API Calls:
  1. GET / (Signup Page)
     - URL: https://novel-nook.vercel.app/
     - Method: GET
  2. GET /home.html (Home Page)
     - URL: https://novel-nook.vercel.app/home.html
     - Method: GET
  3. GET /mybooks (Fetch Liked Books)
     - URL: https://novel-nook.vercel.app/mybooks
     - Method: GET
     - Headers: Authorization: Bearer <your-jwt-token>
  4. GET /protected (Protected Route Example)
     - URL: https://novel-nook.vercel.app/protected
     - Method: GET
     - Headers: Authorization: Bearer <your-jwt-token>
  5. GET /mybooks.html (My Books Page)
     - URL: https://novel-nook.vercel.app/mybooks.html
     - Method: GET
     - Headers: Authorization: Bearer <your-jwt-token>

 ## Summary of POST Requests
 1. POST /signup (Add New User)
    - URL: https://novel-nook.vercel.app/signup
    - Method: POST
    - Headers: Content-Type: application/json
    - Body: {"userName": "testuser", "fullName": "Test User", "userEmail": "test@example.com", "userPass": "password123"}
    - Returns: A new user is added to supabase user's table.
   
 2. POST /signup (Add New User)
    - URL: https://novel-nook.vercel.app/login
    - Method: POST
    - Headers: Content-Type: application/json
    - Body: {"userEmail": 'user's email', "userPass": 'user's password'}
    - Returns: Login successful message and your JWT Token
   
 3. POST /store-book (Store Book Data)
    - URL: https://novel-nook.vercel.app/store-book
    - Method: POST
    - Headers: Content-Type: application/json ; Authorization: Bearer <your-jwt-token>
    - Body: {"olid": "OL12345W", "isbn": "9781234567890", "book_title": "Sample Book", "book_genre": "Fiction", "book_description": "A sample book description.", "book_author": "Author Name"}
    - Returns: New Book is added to your account 

## Summary of DELETE Requests
1. DELETE /delete-book (Delete Book)
    - URL: https://novel-nook.vercel.app/delete-book
    - Method: DELETE
    - Headers: Content-Type: application/json ; ; Authorization: Bearer <your-jwt-token>
    - Body: {"userName": "testuser", "isbn": "9781234567890}
    - Returns: Validates and deletes the entry for the defined user

### Expectations Around Known Bugs and Roadmap for Future Development
On the Explore page, the API takes a few seconds to load and populate the web page, in the future we will try to fix the load time. Additionally, when populating the web page with books, sometimes descriptions or book covers are missing, in the future, we hope to either 1) remove books that are missing elements or 2) reflect the missing element better on the page by adding a placeholder so the page doesn't look "empty". 
<br>
Additionally, our user login/sign-up capabilities are currently limited at the moment, no way of making sure there are not duplicate emails or being able to reset a forgetten password to name a few. 

