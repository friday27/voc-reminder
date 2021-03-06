# Voc Reminder

Build a Line ChatBot to let users save and review vocabularies.

## TODOs

* Logo [done]
* PostgreSQL - CRUD [done]
* Cache [done]
* License [done]
* LineBot Rich Menu [done]
* Deploy on Heroku [done]
* Deploy on AWS
* Test Cases (Mocha)
* How-to
* default word list and import/export

## config/dev.env

    // Below variables are needed
    ENV=local
    PORT=...
    REDIS_URL=...(local redis port)
    LINE_CHANNEL_ID=...
    LINE_CHANNEL_SECRET=...
    LINE_CHANNEL_ACCESS_TOKEN=...
    DATABASE_URL=postgres://...

## PostgreSQL

* Login `heroku pg:psql`

* Create table

      CREATE TABLE voc (
        id serial NOT NULL PRIMARY KEY,
        user_id VARCHAR(80) NOT NULL,
        word VARCHAR(80) NOT NULL,
        annotation VARCHAR(80),
        level INT DEFAULT 1,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        unique (user_id, word)
      );

      CREATE TABLE status (
        user_id VARCHAR(80) NOT NULL,
        mode VARCHAR(30) DEFAULT 'normal',
        pointer INT DEFAULT 0,
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        unique (user_id)
      );

## Test Changes Locally

1. Start ngrok `ngrok http 3000` (Change 3000 to your port)
2. Update webhook URL on Line Messaging API page to https://xxxxxx.ngrok.io/yourWebhookName
3. Start redis `redis-server` (Run redis CLI from a different terminal `redis-cli`)

       // redic cli
       get key
       set key value

4. `npm run dev`
5. Test your change via Line account

## References

### Line ChatBot

* [手把手教你建聊天機器人(linebot+nodjes+ngrok)](https://medium.com/@mengchiang000/%E6%89%8B%E6%8A%8A%E6%89%8B%E6%95%99%E4%BD%A0%E5%BB%BA%E8%81%8A%E5%A4%A9%E6%A9%9F%E5%99%A8%E4%BA%BA-linebot-nodjes-ngrok-7ad028d97a07)
* [Line Emoji Reference](https://devdocs.line.me/files/emoticon.pdf)

### Postgre

* To solve self certificate problem, uninstall pq module and reinstall it with `npm install pq@7`
* [Problem: Couldn't connect to local server](https://stackoverflow.com/questions/13573204/psql-could-not-connect-to-server-no-such-file-or-directory-mac-os-x)
* [Setting up a RESTful API with Node.js and PostgreSQL](https://blog.logrocket.com/setting-up-a-restful-api-with-node-js-and-postgresql-d96d6fc892d8/)
* [Heroku: Provision a database](https://devcenter.heroku.com/articles/getting-started-with-nodejs#provision-a-database)
* [node-postgres](https://node-postgres.com/)

### Spaced Repetition

* [Spaced repetition algorithm](https://zh.wikipedia.org/wiki/%E9%97%B4%E9%9A%94%E9%87%8D%E5%A4%8D)

### Caching (Redis)

* [Learn to Cache your NodeJS Application with Redis in 6 Minutes!](https://itnext.io/learn-to-cache-your-nodejs-application-with-redis-in-6-minutes-745a574a9739)
* [Heroku Redis](https://devcenter.heroku.com/articles/heroku-redis#connecting-in-node-js)

### Mocha

* [Mocha official guide](https://mochajs.org/)

* [[Node.js] 用 mocha 做單元測試](https://medium.com/cubemail88/node-js-%E7%94%A8-mocha-%E5%81%9A%E5%96%AE%E5%85%83%E6%B8%AC%E8%A9%A6-16dd9125e632)

### Others

* [How to make a setTimeout function continuously loop?](https://stackoverflow.com/questions/17126758/how-to-make-a-settimeout-function-continuously-loop)
* [詳述 GitHub 中聲明 LICENSE 的方法](https://blog.csdn.net/qq_35246620/article/details/77647234)
