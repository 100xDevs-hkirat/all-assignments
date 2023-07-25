## Assignment 2
Move this JS project to typescript.

 - It's harder to move a react project to TS, although totally possible with the naive approach of moving files from jsx => tsx, and then fixing all the errors.
 - It's easier to re-bootstrap the initial configuration using vite, and then move the files over.
   - This is because the initial configuration is a lot of work, and it's easier to just re-bootstrap it.
 - Go one folder below this folder (go to week-7)
 - Run  npm create vite@latest
    - Select react
    - Select typescript
    - Name the new folder `assignment-2-solution`
    - Notice how the tsconfig.json has a bunch of things we haven't seen before. This is why bootstraping the new app is much easier than incrementally creating a new tsconfig.json.
 - Bring dependencies to the new project - 
   - npm install recoil
   - npm install react-router-dom
 - Now start moving components over. Make sure you're replacing
   - .jsx => .tsx
   - .js => .ts
 - After you've moved all the files over, things should just work
 - At this point a good question to ask is what benefit did we get after moving from JS to TS in react? It seems like we just changed the file names, didn't add any types.
 - The answer is that we can now add types incrementally. We can start by adding types to the components.
 - Also create a type for all the requests you are making to the backend. This should be the same as the one you created for your backend app.
   - For example, a type called SignupRequest which looks like this - 
   - ```ts
     export type SignupRequest = {
       username: string;
       password: string;
     };
     ```
 - Create a type for Todo which the backend returns to you. Use the type in all the places where you get back a todo from the backend.
  
A good question to ask in this assignment is what benefit does TS give us in react? It seems like we just changed the file names, and forcefully added some types
The answer is that as your app gets more complex, and you send down props through your app, you will start to see the benefit of TS. You will be able to catch bugs at compile time, and your react app wont crash at runtime. This is a huge benefit, and it's worth the effort of moving to TS. 