
# Blog admin dashboard

Dashboard for admins to manage the content of the blog.


## Introduction

Side platform for The blog, where admins can see and manage all the content related to the blog. It consumes the same API as the main blog.
This project was created as a part of The Odin Project Nodejs course curriculum's. \
<br/>
<img width="400" alt="Screenshot of the admin dashboard displaying posts" src="https://github.com/user-attachments/assets/a6f28cb4-04d2-4c70-921b-55586558d3de">



## Tech Stack

[![Thecnologies used (React, CSS, Vite, Figma)](https://skillicons.dev/icons?i=react,css,vite,figma)](https://skillicons.dev)


## Features

- Integration with a WYSIWYG editor (tiny MCE)
- See all posts, users and comments.
- Search functionality
- Create and mantain post drafts to publish them later
- Modify the status of a user. Ban or promote to admin

## Run Locally

#### Pre-requisites
The live API only accept incoming requests from the live frontends, so to run this and fetch data correctly, you'll need your own local version of the API. You can read more about the API and how to set it locally [here](https://github.com/GabyAM/blog-api) \
Also, if you want to use the post content editor, you will need a TinyMCE API key. You can get one for free at https://www.tiny.cloud/auth/signup/

#### How to run
Clone the project

```
git clone https://github.com/GabyAM/blog-admin-dashboard
```

Once in the folder, install dependencies

```
npm install
```
Create a .env file in the root folder and insert you TinyMCE API key. Omit this step if you don't need that functionality
```
TINYMCE_EDITOR_API_KEY = your_key_goes_here
```
Open the "constants.js" file inside src and replace the API URL 
```
export const API_URL = 'http://localhost:3000'; 
//or whatever port you are using for the API
```
Run the app in dev mode

```
  npm run dev
```

## Related

You can check the repos of the other blog parts: \
[API](https://github.com/GabyAM/blog-api) \
[Main blog](https://github.com/GabyAM/the-blog)
