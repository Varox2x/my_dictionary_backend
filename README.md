# Fishcards
## Application to learn English

,,Fishcards" is application created to help you improve your language skills, specifically, learn new words.
<br>Visit [Fishcards](https://flashcards-kcc4.onrender.com/register)
<br>Visit [frontend repo](https://github.com/Varox2x/my_dictionary_frontend/)

![Fiszky](https://github.com/Varox2x/my_dictionary_frontend/assets/95167789/e8b7fcbb-8304-42a6-b421-d95f2b5f584a)

## Features

- Learn Mode:
Page view intended for learning, allows user to scroll through the tabs. Every card consists of three items: name (written word in a language you know), definition (foreign language equivalent), example sentences (example sentences in which you use the word). To make the application scalable, there are created features called ,,stages". Every stage must be related to one of the side (Front - there is a name, Back - there is a definition). Stages are intended for actions for that particular side of the card. Their icons are in the right upper corener, if you want to make certain stage appear, just click an relevant icon - their availability depends on the revealed.
<br>The bulb icon -  a user can see several letters of definition word.
<br>The tick icon -  when user clicks this icon, they can practise spelling.
<br>The test icon - shows example sentences.

- Edit Mode
This functionality allows user to add new words or edit existing ones.

- Permissions
There are 3 types of a connection between the set and users:
<br> OWNER - allows a user to edit/add words, grant permission to other users and delete set.
<br> EDITABLE - allows a user to edit/add words only.
<br> READ_ONLY - allows a user only to read/learn words (learn mode)
<br> (To grant permission a user has to enter Edit mode and then enter set settings)

## TO DO

| Features | Backend | Frontend |
|------------|------------|------------|
| level of knowlage of word | [x] | [ ] |
| listening to the pronunciation | [ ] | [ ] |
| Sentry | [ ] | [ ] |
| mailer | [ ] | [ ] |
| implement user tutorial | [ ] | [ ] |
| tests | [ ] | [ ] |
| find a graphic designer | [ ] | [ ] |

## Front-End Tech

- React & Typescript
- Vite
- ReactQuery
- StyledComponent
- React Router
- Framer Motion

State managmend is based on React Context and React Query. To fetch data there are custom hooks (based on React Query hooks and Axios). Sidebar on desktop is supported by ,,react-pro-sidebar". To create animation Framer Motion has been used.

## Back-End Tech

- NestJs
- Postgres
- TypeORM

To authorize users there is JWT (access & refresh token). 
Project consists of 3 services:
<br> auth - responsible for authorizations and user support
<br> accesses -responsible for users access to set (database relation user - access - set), access validation
<br> word -creating, updating word etc.
<br> sets - creating, updating set etc.


## Docker

To make working on the backend application convenient, there is a docker. 

To start application in docker, visit root folder, then enter belows commends:

```sh
docker-compose build
docker-compose up
```

Fill the variables in the .env file before running, if the variables don't match, the application will notify you when you run it. By default backend application is running on port 3000.
