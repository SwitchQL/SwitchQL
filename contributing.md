# Contributing to SwitchQL

#### Table Of Contents

[Code of Conduct](#code-of-conduct)

[Working on the Project](#working-on-the-project)

[Feature Requests and Issues](#feature-requests-and-issues)

[Pull Requests](#pull-requests)

[Project Architecture](#project-architecture)
* [DB Metadata](#dbmetadata)
* [Generators](#generators)
* [Electron](#electron)

[Running the Project Locally](#running-the-project-locally)

[Debugging](#debugging)

[Testing](#testing)


## Code of Conduct
Don't be a jerk

## Working on the project
If you would like to contribute, please fork the repository and make a pull request into the dev branch when you are ready to have your code reviewed.

**Please contact the maintainers before starting work on an open issue**

We track all of our work in Jira, which unfortunately we can't make public. To that end, if there is an issue that you are interested in fixing or a feature you would like to implement -  **please let us know before you start working on it.** 


**We reserve the right to reject any pull requests for issues that someone else is already working on.**


## Feature Requests and Issues 
If you have a question, concern, issue, or find a bug in the software; please click on the issues tab and file a bug report. If you have a request for a new feature, please click on the issues tab and submit a feature request


## Pull Requests
Pull requests should be made from forks into the dev branch of the repository. We follow a rebase and squash workflow. Please rebase the upstream dev branch onto the feature branch of your fork and squash any unnecessary commits before you open a pull request. Your commit message should include the ticket number of the open issue you are working on, this ticket number ties back to our Jira board. The ticket number can be requested from one of the project contributors.

**Pull requests that are open for a month with no response from authors will be removed**



## Project Architecture
At a high level the project consists of 3 module:. 
- Module to contact a database, retrieve metadata about the tables, and process it into a more usable format. (DBMetadata)
- Module to create graphql code out of the retrieved and processed metadata. (Generators)
- Module which glues everything together, and exposes a ui to the user. (Electron)

#### DBMetadata:
- MetadataRetriever: The metadata retrievers expose methods to query a database for table metadata. Similar to the providers, there is a retriever per database type. The metadata retrievers adhere to the MetadataRetrieve interface.

- The MetadataProcessor recieves metadata retrieved from the retriever and processes it into a format that is easier to work with and provides a data contract to the graphql generators.

- The column type translators are a group of functions (one per database type) which tell the metadata processor how to map between data types for the targeted database and common graphql data types

#### Generators:
- builder: The classes in this folder are the workhorses of graphql generation. They iterate over the table metadata and produce the graphql code. The MutationBuilder produces client mutations consumed by apollo, the QueryBuilder produces client queries consumed by apollo, and the TypeBuilder generates the schema used to spin up a graphql server

- provider: The providers expose a polymorphic way to generate code for different database providers. The javascript code that needs to be generated for postgres for example is different than that which needs to be generated for mssql. All providers adhere to a common interface: DBProvider. The correct database provider gets chosen at runtime depending on which database type the user specifies

#### Electron:
- client: All of the react ui code is located here
- ipcHandlers: File where interprocess communication handlers are registered so that the main electron process can communicate with the renderer process (allowing the react code to send events to the main process and vice versa). This is where the retriever, processor and generator code gets called.
- main: The main electron process which is what actually gets launched when the project is started


## Running the project locally
- Clone the **dev** repo using `git clone`
- Install the dependencies `npm install`
- Run `npm start` to start the webpack server and electron application
- Run `npm test` to make sure everything works before you make a PR


## Debugging
When `npm start` is run, the electron process begins and listens for debug messages on port `9223`. If you are using vs code, you can use the debugging profile included in the .vscode folder of the repository to attach the debugger to the running process.

## Testing
We require that all pull requests (where applicable) include a reasonable amount of automated tests. A mixture of unit and integration tests are preferred. All tests can be found in the \_\_tests__ folder. We use jest as our test runner.

