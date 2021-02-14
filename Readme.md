# Monopoly Toy Program

This is a monopoly game made in NodeJS.  It uses OOP techniques as a demonstration.

## Layout 

* models - contains all the game logic or 'models'
* platform - contains the 'views' that will differ whether its on the command line or on the web.
* config - the game data files, in case you want to write your own version of the Monopoly board
* mocks - the mock objects to help with testing
* test - the test routines, the directory structure mirrors others

## Run Console Application

```
npm run console
```

## Unit Testing

* using the Mocha library setup as per the default (https://mochajs.org/)

```
npm test
```