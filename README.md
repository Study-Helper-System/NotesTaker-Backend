## How to Run ?
- install packages
    ```
    npm install
    ```
- run the backend server
    ```
    npm start
    ```
- run mongo server with username : `root` and password : `example`
- remember to add your gemini API in a env.
  - create a file named .env
  - get your gemini api key from the [Google AI Studio](https://aistudio.google.com/apikey)
  - write the below text in your .env file :
    ```
    GEMINI_API_KEY="<PASTE YOUR API KEY HERE>"
    ```
  - Do this step before running `npm start` 
