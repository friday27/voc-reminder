
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

const errMsg = '很抱歉，後台出了一點問題。我們將盡快修復。';

const query = function(queryString, callback) {
  const start = Date.now();
  pool.query(queryString, (err, res) => {
    if (err) {
      console.log(err);
      callback(err);
    }
    callback(null, res.rows);
  });
  const duration = Date.now() - start;
  console.log('executed query', {queryString, duration});
};
// query('SELECT * FROM status;', (err, res) => {
//   console.log(err, res);
// });

const addWord = function (userId, word, annotation, event) {
  // Check if daily created words > 15
  query(`SELECT count(1) 
         FROM voc
         WHERE user_id = '${userId}'
         AND created_at > now() - interval '1 day';`, (err, res) => {
    if (err) {
      console.log(err);
      event.reply(errMsg);
    }
    const num = parseInt(res[0].count);
    if (num >= 15) {
      event.reply(`你今天已經新增${num}個單字囉! 每24小時只能新增15個單字`);
    } else {
      query(`INSERT INTO voc (user_id, word, annotation) 
             VALUES ('${userId}', '${word}', '${annotation}') 
             ON CONFLICT (user_id, word) 
             DO UPDATE SET annotation = '${annotation}',
                           updated_at = NOW();`, (err, res) => {
        if (err) {
          console.log(err);
          event.reply(errMsg);
        }
        event.reply(`已將 ${word} (${annotation}) 存到資料庫`);
      });
    }
  });
};

const updateWord = function(userId, word, annotation, event) {
  // Check if the word is in user's list
  query(`SELECT word
         FROM voc
         WHERE user_id = '${userId}'
         AND word = '${word}';`, (err, res) => {
    if (err) {
      console.log(err);
      event.reply(errMsg);
    } else if (res.length === 0) {
      event.reply(`${word} 不在你的單字本中喔`);
    } else {
      query(`UPDATE voc
             SET annotation = '${annotation}',
                 updated_at = NOW()
             WHERE word = '${word}'
             AND user_id = '${userId}';`, (err, res) => {
        if (err) {
          console.log(err);
          event.reply(errMsg);
        }
        event.reply(`已將資料更新為 ${word} (${annotation})`);   
      });
    }
  });
};

const showWords = function (userId, event) {
  query(`SELECT word, annotation
         FROM voc
         WHERE user_id = '${userId}'
         ORDER BY level ASC, updated_at ASC;`, (err, res) => {
    if (err) {
      console.log(err);
      event.reply(errMsg);
    }

    if (res.length === 0) {
      event.reply('你的單字本裡面沒有單字欸');
    } else {
      let msg = '';
      for (let i in res) {
        msg += `${res[i].word}\n${res[i].annotation}\n--\n`;
      }
      event.reply(msg);
    }
  });
};

const deleteWord = function (userId, word, event) {
  query(`DELETE FROM voc 
         WHERE user_id = '${userId}' 
         AND word = '${word}';`, (err, res) => {
    if (err) {
      console.log(err);
      event.reply(errMsg);
    }
    event.reply(`已將 ${word} 從你的單字本移除`);
  });
};

const words = function (rows) {

};

const reviewWords = function (userId, event) {
  // 1. Save user's top 25 words into a temp table
  query(`CREATE TABLE review_${userId} AS
           SELECT voc.word, voc.annotation, voc.level
           FROM voc
           WHERE user_id = '${userId}'
           ORDER BY level ASC, updated_at ASC
           LIMIT 25;`, (err, res) => {
    if (err) {
      console.log(err);
      event.reply(errMsg);
    }
    query(`ALTER TABLE review_${userId}
           ADD COLUMN correct INT DEFAULT 0;`, (err, res) => {
      if (err) {
        console.log(err);
        event.reply(errMsg);
      }
    });

    // Show table
    query(`SELECT * FROM review_${userId}`, (err, res) => {
      console.log(err, res);
    })

    // get user's answers and update temp table (correct and level)

    // send score back

    // Drop temp table
    // query(`DROP TABLE review_${userId};`, (err, res) => {
    //   console.log(err, res);
    // });
  });  

  
};

module.exports = {
  addWord,
  updateWord,
  showWords,
  deleteWord,
  reviewWords
  // query: (queryString, callback) => {
  //   const start = Date.now();
  //   return pool.query(queryString, (err, res) => {
  //     const duration = Date.now() - start;
  //     console.log('executed query', {queryString, duration}); //, rows: res.rowCount});
  //     callback(err, res);
  //   })
  // },
};