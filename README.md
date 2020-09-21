# Kappa Theta Pi at the University of Pittsburgh

## About us
We are a co-ed professional technology fraternity located at the University of Pittsburgh that participates fully in the thriving tech scene of our city. Our organization aims to better its members through:
* Community Service
* Field experience such as hackathons and contributing to our website
* Mentoring
* Attending tech talks with local companies such as Google, Dick's Sporting Goods, UPMC, and many more
* Social events

## Our Website
Our website is meant to not only give an outsider a perspective on our fraternity, but also allow existing members and alumni to login and view important information that pertain to their role in the fraternity.

### The Website Right Now
Current functionality allows for members to create accounts and login in order to view a community board of how many brotherhood points each member has obtained. With this, members can submit point requests that state how many points or service hours they have received (through means of community service, events, etc.) and a member of the executive board can accept or deny this request. Members of e-board are given the role of "admins" and have additional power to edit current members. There is also functionality for attendence taking that increments unexcused absences at chapter meetings. Recently added functionality includes a profile page where members can edit infomation about themselves that is available to other logged in members. A members page is publically available that lists all current, inactive, and alumni members. The public can see member's name, major, and description about themselves.

### The Website in the Future
In the future (as soon as tomorrow or a year from now) we would like to implement helpful features such as:
* A community page where members can submit ideas they have for future KTP events or even just general questions
* Functionality to handle live voting (for when we elect new e-board members once per year)
* A user dashboad page where the user will be able to see a calendar of upcoming KTP events, feeds from the various KTP social media platforms, announcements, and more.
* Generate a report of number of members, brotherhood points, service hours, and unexcused absences over a period of time such as a semester, a single month, etc.

## The Tech Behind the Website
We are using React 16 for our frontend with React-Bootstrap as a CSS Framework, Node.js with the Express.js framework for our backend REST API, MongoDB Atlas for our database, and NGINX as a web server. The site is hosted on Amazon AWS, utilizing the following services: Route53 for DNS, Elastic Load Balancer for application load balancing, EC2 for our cloud VM, and IAM to provide credentials. Also, Docker is used to "containerize" the frontend and backend application. The docker containers run on our EC2 VM.

### Frontend
For the frontend (UI) we've migrated away from Angular 6 to React 16 for a less bloated bundle, easier learning curve for beginners, stable API, and awesome React Hooks feature allowing us to write basic JavaScript functions to create stateful components. React is an awesome library that does much of the heavy lifting for you so that you can simply focus on creating the best UI for your user. We are in the age of reactive programming, so we take advantage of the Redux library to better manage state across the application with a single source of truth.

### Backend
For our backed REST API, we use Node.js which is a very popular JavaScript runtime that has extensive libraries to take advantage of. For example, Mongoose is a wonderful MongoDB ODM which makes interfacing with our database easy and intuitive, and Express.js is time-saving minimalist web framework which makes setting up Node.js servers painless.

## Ok Cool, But How Do I Run This?
In oder to run this locally, you have to install some dependencies for all layers of the application (React, Node.js, MongoDB). Start by cloning this project to your local machine with:
```
git clone https://github.com/pittktp/ktp-react.git
```
And then navigate to the cloned repository's directory.

### Prerequisites
You have to have the Classic Yarn package manager installed. Yarn is a nice command-line tool that lets you easily set up dependencies that you may need for React and Node.js. Note that we need the classic version of Yarn (version 1.x) and not the newest version of Yarn (vesion 2.x).
To check if you have Yarn installed go to your command-line terminal and type "yarn versions". You should have version 1.22.4.
If you don't have it installed, go to https://classic.yarnpkg.com/en/docs/install

#### React (Frontend)
To install the frontend dependencies, navigate to the root of the cloned repository and type in a terminal:
```
yarn install
```
Now you're able to run the frontend with:
```
yarn start
```
Go to http://localhost:3000 in your browser and you're able to see the website. However, since we don't have the backend or database setup yet, you won't be able to do things like login which requires the server.

#### Node.js (Backend)
The backend isn't as heavy code-wise as the frontend, as it's only really responsible for taking data from the frontend and saving or manipulating it in the database, or pulling from the database and sending it back to the frontend. Set up your backend dependencies by navigating to the "server" folder and typing in a terminal:
```
yarn install
```
and run the backend with:
```
yarn start
```
OR (if you want hot-reloading so you can see your changes as you edit the server)
```
yarn dev
```
You will likely notice that the server returns an error. This is because it is failing to connect to the database, the last piece before we'll be fully set up. See how to set that up below.

#### MongoDB (Database)
For our database, we'll be using a MongoDB Atlas cluster, however that is only for the live production application. For running locally, we'll need to run a local instance of MongoDB as well. First we need to install MongoDB, you can get it here: https://www.mongodb.com/download-center/community. Additionally, while not required to run the site, it is highly recommended that you also download MongoDB Compass, which will allow you to view the contents of your local database instance. You can get Compass here: https://www.mongodb.com/products/compass.

Now you'll just need to run Mongo. For this I recommend checking the MongoDB Docs, as I cannot explain it better than themselves and it contains the instructions for multiple platforms (Windows, macOS, Linux). You can view those docs here: https://docs.mongodb.com/guides/server/install/#run-mongodb.

#### Environment Variables
For some features to properly work on the site, but are sensitive information we don't want to have publicly available, we use environment variables set in a .env file for the front and backends. This file is not included with the reposity, so if for some reason you do not have those files, please let your current Technology Chair know.