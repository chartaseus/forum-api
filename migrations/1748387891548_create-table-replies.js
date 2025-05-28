/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: 'id',
    body: 'body',
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      referencesConstraintName: 'fk_replies.owner_users.id',
      onDelete: 'CASCADE',
    },
    parent: {
      type: 'VARCHAR(50)',
      references: 'comments',
      referencesConstraintName: 'fk_replies.parent_comments.id',
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
  pgm.dropTable('replies');
};
