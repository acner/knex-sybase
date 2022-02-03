// MySQL Column Compiler
// -------
const { inherits } = require('util');
const ColumnCompiler = require('knex/lib/schema/columncompiler');

function ColumnCompiler_SYBASE() {
  ColumnCompiler.apply(this, arguments);
  this.modifiers = ['nullable', 'defaultTo', 'first', 'after', 'comment'];
}
inherits(ColumnCompiler_SYBASE, ColumnCompiler);

// Types
// ------

Object.assign(ColumnCompiler_SYBASE.prototype, {
  increments: 'INTEGER DEFAULT AUTOINCREMENT',

  bigincrements: 'INTEGER DEFAULT AUTOINCREMENT',

  bigint: 'bigint',

  double(precision, scale) {
    return 'double';
  },

  floating(precision, scale) {
    // ignore precicion / scale which is mysql specific stuff
    return `float`;
  },

  integer() {
    // SYBASE does not support length
    return 'integer';
  },

  mediumint: 'integer',

  smallint: 'smallint',

  tinyint() {
    // SYBASE does not support length
    return 'tinyint';
  },

  varchar(length) {
    return `nvarchar(${this._num(length, 255)})`;
  },

  text: 'text',

  mediumtext: 'nvarchar(max)',

  longtext: 'nvarchar(max)',

  // TODO: SYBASE supports check constraints as of SQL Server 2008
  // so make enu here more like postgres
  enu: 'nvarchar(100)',

  uuid: 'NEWID()',

  datetime: 'datetime',

  timestamp({ useTz = false } = {}) {
    return useTz ? 'TIMESTAMP' : 'datetime';
  },

  bit(length) {
    if (length > 1) {
      this.client.logger.warn('Bit field is exactly 1 bit length for SYBASE');
    }
    return 'bit';
  },

  binary(length) {
    return length ? `binary(${this._num(length)})` : 'binary(max)';
  },

  bool: 'bit',

  // Modifiers
  // ------

  first() {
    this.client.logger.warn('Column first modifier not available for SYBASE');
    return '';
  },

  after(column) {
    this.client.logger.warn('Column after modifier not available for SYBASE');
    return '';
  },

  comment(comment) {
    if (comment && comment.length > 255) {
      this.client.logger.warn(
        'Your comment is longer than the max comment length for SYBASE'
      );
    }
    return '';
  },
});

module.exports = ColumnCompiler_SYBASE;
