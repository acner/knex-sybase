# [knex.js](http://knexjs.org)

[![npm version](http://img.shields.io/npm/v/knex.svg)](https://npmjs.org/package/knex)
[![npm downloads](https://img.shields.io/npm/dm/knex.svg)](https://npmjs.org/package/knex)
![](https://github.com/knex/knex/workflows/CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/knex/knex/badge.svg?branch=master)](https://coveralls.io/r/knex/knex?branch=master)
[![Dependencies Status](https://david-dm.org/knex/knex.svg)](https://david-dm.org/knex/knex)
[![Gitter chat](https://badges.gitter.im/tgriesser/knex.svg)](https://gitter.im/tgriesser/knex)
[![Language Grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/knex/knex.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/knex/knex/context:javascript)

> **A SQL query builder that is _flexible_, _portable_, and _fun_ to use!**

A batteries-included, multi-dialect (MSSQL, MySQL, PostgreSQL, SQLite3, Oracle (including Oracle Wallet Authentication)) query builder for
Node.js, featuring:

- [transactions](http://knexjs.org/#Transactions)
- [connection pooling](http://knexjs.org/#Installation-pooling)
- [streaming queries](http://knexjs.org/#Interfaces-Streams)
- both a [promise](http://knexjs.org/#Interfaces-Promises) and [callback](http://knexjs.org/#Interfaces-Callbacks) API
- a [thorough test suite](https://travis-ci.org/knex/knex)
- the ability to [run in the Browser](http://knexjs.org/#Installation-browser)

Node.js versions 10+ are supported.

[Read the full documentation to get started!](http://knexjs.org)  
[Or check out our Recipes wiki to search for solutions to some specific problems](https://github.com/knex/knex/wiki/Recipes)  
If upgrading from older version, see [Upgrading instructions](https://github.com/knex/knex/blob/master/UPGRADING.md)

For support and questions, join the `#bookshelf` channel on freenode IRC

For an Object Relational Mapper, see:

- http://bookshelfjs.org
- https://github.com/Vincit/objection.js

To see the SQL that Knex will generate for a given query, see: [Knex Query Lab](https://michaelavila.com/knex-querylab/)

## Examples

We have several examples [on the website](http://knexjs.org). Here is the first one to get you started:

```js
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './data.db',
  },
});

// Create a table
knex.schema
  .createTable('users', table => {
    table.increments('id');
    table.string('user_name');
  })

  // ...and another
  .createTable('accounts', table => {
    table.increments('id');
    table.string('account_name');
    table
      .integer('user_id')
      .unsigned()
      .references('users.id');
  })

  // Then query the table...
  .then(() =>
    knex('users').insert({ user_name: 'Tim' })
  )

  // ...and using the insert id, insert into the other table.
  .then(rows => 
    knex('accounts').insert({ account_name: 'knex', user_id: rows[0] })
  )

  // Query both of the rows.
  .then(() => 
    knex('users')
      .join('accounts', 'users.id', 'accounts.user_id')
      .select('users.user_name as user', 'accounts.account_name as account')
  )

  // map over the results
  .then(rows =>
    rows.map(row => {
      console.log(row)
    })
  )

  // Finally, add a .catch handler for the promise chain
  .catch(e => {
    console.error(e);
  });
```
