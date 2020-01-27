const { Pool, Client } = require('pg');
const { connectionString } = require('./keys');

const pool = new Pool({ connectionString });

pool.query('SELECT NOW()').then(res => {
    console.log('Connected to the database');
}).catch(err => console.log(err));

module.exports = pool;