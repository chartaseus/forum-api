const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    // return DomainErrorTranslator._directories[error.message] || error;

    const [domain, key] = error.message.split('.');

    if (!(domain in this._glossary)) return error;

    return new InvariantError(
      this._glossary[domain].message
      + (this._glossary[domain].message ? ' karena ' : '')
      + this._glossary[domain].description[key]);
  },
};

// DomainErrorTranslator._directories = {
//   'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
//   'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
//   'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
//   'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
//   'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
//   'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
//   'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
//   'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
//   'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
//   'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
// };

DomainErrorTranslator._glossary = {
  REGISTER_USER: {
    message: 'tidak dapat membuat user baru',
    description: {
      NOT_CONTAIN_NEEDED_PROPERTY: 'properti yang dibutuhkan tidak ada',
      NOT_MEET_DATA_TYPE_SPECIFICATION: 'tipe data tidak sesuai',
      USERNAME_LIMIT_CHAR: 'karakter username melebihi batas limit',
      USERNAME_CONTAIN_RESTRICTED_CHARACTER:
        'username mengandung karakter terlarang',
    },
  },
  USER_LOGIN: {
    message: '',
    description: {
      NOT_CONTAIN_NEEDED_PROPERTY: 'harus mengirimkan username dan password',
      NOT_MEET_DATA_TYPE_SPECIFICATION: 'username dan password harus string',
    },
  },
  REFRESH_AUTHENTICATION_USE_CASE: {
    message: '',
    description: {
      NOT_CONTAIN_REFRESH_TOKEN: 'harus mengirimkan token refresh',
      PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION: 'refresh token harus string',
    },
  },
  DELETE_AUTHENTICATION_USE_CASE: {
    message: '',
    description: {
      NOT_CONTAIN_REFRESH_TOKEN: 'harus mengirimkan token refresh',
      PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION: 'refresh token harus string',
    },
  },
  POST_THREAD: {
    message: 'gagal memposting thread',
    description: {
      PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY: 'judul atau badan thread kosong',
      PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION: 'judul atau badan thread tidak berupa string',
    },
  },
  POST_COMMENT: {
    message: 'gagal memposting komentar',
    description: {
      PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY: 'komentar tidak boleh kosong',
      PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION: 'komentar tidak berupa string',
      THREADID_LIMIT_CHAR: 'thread tidak valid',
    },
  },
};

module.exports = DomainErrorTranslator;
