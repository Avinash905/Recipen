# Recipen 🍴

<h3>Description :</h3> 
Explore a world of flavors with Recipen! Indulge in a community-driven platform where food enthusiasts share their cherished recipes and captivating food blogs. Join as a pro user to contribute your own culinary creations. Unlock a realm of taste, culture, and creativity.

<br/>

🚀[Click here](https://recipen.vercel.app/) to check out the app.

### 📃Features :

<ul>
    <li><strong>Authentication:</strong> Users can securely create accounts and log in to access personalized features and content.</li>
    <li><strong>Recipes:</strong> Explore a rich collection of authentic recipes contributed by the community, covering a wide range of cuisines and tastes.</li>
    <li><strong>Food Blogs:</strong> Engage with insightful and creative food blogs written by enthusiasts, offering valuable insights and cooking inspiration.</li>
    <li><strong>Stripe Payment Integration:</strong> Seamlessly integrated Stripe for secure payment processing, enhancing user experience during transactions.</li>
    <li><strong>One-Time Payment Subscription:</strong> Offer users the option to subscribe with a one-time payment, unlocking exclusive features and benefits.</li>
    <li><strong>Pro User Access:</strong> Pro users enjoy the privilege of adding and deleting recipes and blogs, creating a dynamic and engaging platform.</li>
    <li><strong>Admin Dashboard:</strong> Admins have access to a dashboard for managing users, recipes, and blogs</li>
    <li><strong>User Profile:</strong> Each user has a personalized profile where they can manage their information.</li>
    <li><strong>Contact Us Page:</strong> A dedicated page for users to reach out with questions, concerns, or feedback, fostering communication.</li>
    <li><strong>Chatbot:</strong> A chatbot that provides one to one assistance with the maintainers of the project.</li>
    <li><strong>Save and Unsave Favorite Recipes:</strong> Users can curate their own collection of favorite recipes for easy access and cooking inspiration.</li>
    <li><strong>Rate and Comment on Recipes:</strong> Registered users can provide ratings and comments on recipes, enhancing the community interaction.</li>
    <li><strong>Comment on Blogs:</strong> Engage in discussions by leaving comments on the food blogs, sharing thoughts and ideas.</li>
    <li><strong>Share Recipe on Social Media:</strong> Users can effortlessly share their favorite recipes on various social media platforms.</li>
</ul>

<hr/>

### To run the project on your local machine

<ol>
<li>Download the project from the git repository</li>
<li>Add .env file in client directory for the frontend which contains</li>

```
VITE_ADMIN_CODE=100
VITE_BASIC_CODE=101
VITE_PRO_CODE=102
VITE_BASE_URL=http://localhost:5173
VITE_SERVER_BASE_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=YOUR_OWN_CLOUDINARY_CLOUD_NAME
VITE_CLOUDINARY_BASE_URL=https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload
VITE_CLOUDINARY_PRESET=YOUR_OWN_CLOUDINARY_PRESET
VITE_FORMIK_SECRET=YOUR_OWN_FORMIK_SECRET
```

**Note:** Replace the **{CLOUD_NAME}** with your own cloudinary cloud name

<li>Add .env file in root directory for the backend which contains</li>

```
PORT=5000
MONGODB_URI=YOUR_OWN_MONGODB_URL
ACCESS_TOKEN_SECRET=YOUR_JWT_SECRET_FOR_ACCESS_TOKEN
REFRESH_TOKEN_SECRET=YOUR_JWT_SECRET_FOR_REFRESH_TOKEN
CLIENT_BASE_URL=FRONTEND_URL
STRIPE_KEY=YOUR_OWN_STRIPE_KEY
STRIPE_PRICE_ID=PRICE_ID_GENERATED_FROM_STRIPE
```

<li>To run the frontend, open a new terminal and run 'cd client/' to go to client directory and execute: npm run dev</li>
<li>To run the backend, go to root directory in the terminal and execute: nodemon server.js</li>
</ol>

### To access the admin dashboard

<ol>
<li>Download the project from the git repository</li>
<li>You need to create your own MongoDB instance and add the MongoDB url to the .env file</li>
<li>Sign up on the website and open your MongoDB collection and manually add the <strong>Admin</strong> field with the value <strong>100</strong> to the object <strong>roles</strong> in a document and then Sign in back on the site</li>
<li>Now you will be able to access the admin dashboard</li>
</ol>

### Home page

<img src="./client/src/assets/home.png" alt='home'/>

### Sign up page

<img src="./client/src/assets/signup.png" alt='signup'/>

### Sign in page

<img src="./client/src/assets/signin.png" alt='signin'/>

### Profile page

<img src="./client/src/assets/profile.png" alt='profile'/>

### Contact page

<img src="./client/src/assets/contact.png" alt='contact'/>

### Recipes page

<img src="./client/src/assets/recipes.png" alt='recipes'/>

### Blogs page

<img src="./client/src/assets/blogs.png" alt='blogs'/>

### Single recipe page

<img src="./client/src/assets/single-recipe.png" alt='single recipe'/>

### Single blog page

<img src="./client/src/assets/single-blog.png" alt='single blog'/>

### Add recipe page

<img src="./client/src/assets/add-recipe.png" alt='add recipe'/>

### Add blog page

<img src="./client/src/assets/add-blog.png" alt='add blog'/>

### Admin users dashboard

<img src="./client/src/assets/users.png" alt='dashboard users'/>

### Admin recipes dashboard

<img src="./client/src/assets/recipes-dashboard.png" alt='dashboard'/>

### Admin blogs dashboard

<img src="./client/src/assets/blog-dashboard.png" alt='dashboard'/>

<hr/>

<br/>

### Tools and technologies used :

<a href="https://www.w3.org/html/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40"/> </a>
<a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40"/> </a>
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="35" height="35"/> </a>
<a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="35" height="35"/> </a>
<a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a>
<a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://github.com/MarioTerron/logo-images/raw/master/logos/expressjs.png" alt="express"  height="20"/> </a>
<a href="https://www.mongodb.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg" alt="mongodb" width="40" height="40"/> </a>
<a href="https://redux.js.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redux/redux-original.svg" alt="redux" width="40" height="40"/> </a>
<a href="https://mui.com/" target="_blank" rel="noreferrer"> <img src="https://devicons.railway.app/i/materialui.svg" alt="material-ui" width="35" height="35"/> </a>
<a href="https://tailwindcss.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="tailwind" width="40" height="40"/> </a>
<br/>

<h3 align="left">Connect with me:</h3>

<p><a href="https://github.com/Avinash905" target="_blank"><img alt="Github" src="https://img.shields.io/badge/GitHub-%2312100E.svg?&style=for-the-badge&logo=Github&logoColor=white" /></a> <a href="https://twitter.com/avinashdunna" target="_blank"><img alt="Twitter" src="https://img.shields.io/badge/twitter-%231DA1F2.svg?&style=for-the-badge&logo=twitter&logoColor=white" /></a> <a href="https://www.linkedin.com/in/dunna-avinash" target="_blank"><img alt="LinkedIn" src="https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white" /></a>
