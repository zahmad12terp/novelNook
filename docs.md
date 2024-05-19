# Developer Manual
<!--Your Developer Manual covers:
* How to install your application and all dependencies
* How to run your application on a server
* How to run any tests you have written for your software
* The API for your server application - all GET, POST, PATCH, etc endpoints, and what they each do
* A clear set of expectations around known bugs and a road-map for future development.-->
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
 Outside of the sub-folders, in the main NovelNook folder are a few JavaScript and JSON files <!--Someone edit this to further explain what these files do-->.

### How to Run Application on a Server
To start the server , we need to include an index file with server up address port defined. Then in terminal enter command “npm start”.

### Testing
We did not have any formal unit testing of code. All code testing was done by refreshing the page after edits were made and viewing the results. 

### API for Server Application - all GET, POST, PATCH, etc endpoints, and what they each do

<!--Someone please explain this in detail-->

### Expectations Around Known Bugs and Roadmap for Future Development
On the Explore page, the API takes a few seconds to load and populate the web page, in the future we will try to fix the load time. Additionally, when populating the web page with books, sometimes descriptions or book covers are missing, in the future, we hope to either 1) remove books that are missing elements or 2) reflect the missing element better on the page by adding a placeholder so the page doesn't look "empty". 
<br><br>
Additionally, our user login/sign-up capabilities are currently limited at the moment, no way of making sure there are not duplicate emails or being able to reset a forgetten password to name a few. 
<!--If anyone has any other bugs add here-->
