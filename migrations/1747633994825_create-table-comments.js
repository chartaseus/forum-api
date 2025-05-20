/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = {
  id: {
    type: 'VARCHAR(50)',
    primaryKey: true,
  },
  body: {
    type: 'TEXT',
    notNull: true,
  },
  is_deleted: {
    type: 'BOOLEAN',
    default: false,
  },
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: 'id',
    body: 'body',
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      referencesConstraintName: 'fk_comments.owner_users.id',
      onDelete: 'CASCADE',
    },
    parent: {
      type: 'VARCHAR(50)',
      references: 'threads',
      referencesConstraintName: 'fk_comments.parent_threads.id',
      onDelete: 'SET NULL',
    },
    time: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    is_deleted: 'is_deleted',
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('comments');
};
