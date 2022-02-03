const Transaction = require('knex/lib/transaction');
const debug = require('debug')('knex:tx');

module.exports = class Transaction_SYBASE extends Transaction {
  begin(conn) {
    debug('%s: begin', this.txid);

    //return conn.tx_.begin().then(this._resolver, this._rejecter);
  }

  async savepoint(conn) {
    debug('%s: savepoint at', this.txid);
    return this.query(conn, `SAVE TRANSACTION ${this.txid}`);
  }

  commit(conn, value) {
    this._completed = true;
    debug('%s: commit', this.txid);
    //return conn.tx_.commit().then(() => this._resolver(value), this._rejecter);
  }

  release(conn, value) {
    return this._resolver(value);
  }

  rollback(conn, error) {
    this._completed = true;
    debug('%s: rolling back', this.txid);

  }

  async rollbackTo(conn, error) {
    debug('%s: rolling backTo', this.txid);
    //await this.query(conn, `ROLLBACK TRANSACTION ${this.txid}`, 2, error);

    //this._rejecter(error);
  }

  // Acquire a connection and create a disposer - either using the one passed
  // via config or getting one off the client. The disposer will be called once
  // the original promise is marked completed.
  async acquireConnection(config, cb) {
    const configConnection = config && config.connection;
    const conn =
      (this.outerTx && this.outerTx.conn) ||
      configConnection ||
      (await this.client.acquireConnection());

    try {
      conn.__knexTxId = this.txid;
      if (!this.outerTx) {
        this.conn = conn;
        //conn.tx_ = conn.transaction();
      }

      return await cb(conn);
    } catch(e) {
      console.log(e)
    }
  }
};
