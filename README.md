# Coachs-online
Front end application

## Links
- [stage](https://coachsonlinedevfront.itsharkz.com/)
- [prod](https://inscription.coachs-online.com/)

## Running and building
Install dependencies first by running:
```shell
 npm i
```

To start a local server:
```shell
 npm run start
```

To build:
 - prod
```shell
 npm run build
```
- stage
```shell
 npm run build-stage
```
## CI
- Each commit pushed to `dev` branch will be built and deployed to [stage](https://coachsonlinedevfront.itsharkz.com/);
- To omit auto deploy add `skip-build` key to your commit message;
- For prod deploy create a commit with `deployfront` keyword in a message and push it to `master` branch;

//hello
"# coachonlinefrontend-master" 
