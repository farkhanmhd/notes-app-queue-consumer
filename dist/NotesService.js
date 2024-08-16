"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
class NotesService {
    constructor() {
        this._pool = new pg_1.Pool();
        this.getNotes = this.getNotes.bind(this);
    }
    async getNotes(userId) {
        const query = {
            text: `SELECT notes.* FROM notes
      LEFT JOIN collaborations ON collaborations.note_id = notes.id
      WHERE notes.owner = $1 OR collaborations.user_id = $1
      GROUP BY notes.id`,
            values: [userId],
        };
        const result = await this._pool.query(query);
        return result.rows;
    }
}
exports.default = NotesService;
