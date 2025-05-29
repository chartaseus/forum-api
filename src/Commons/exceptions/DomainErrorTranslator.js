const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    const [domain, key] = error.message.split('.');

    if (!(domain in this._glossary)) return error;

    const message = this._glossary[domain].message
      + (this._glossary[domain].message ? ' karena ' : '')
      + this._glossary[domain].description[key];

    return new InvariantError(message);
  },
};

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
  DELETE_COMMENT_USE_CASE: {
    message: 'gagal menghapus komentar',
    description: {
      PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY: 'data yang dibutuhkan tidak lengkap',
      PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION: 'tipe data tidak sesuai',
    },
  },
  POST_REPLY: {
    message: 'gagal memposting balasan',
    description: {
      PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY: 'balasan tidak boleh kosong',
      PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION: 'balasan tidak berupa string',
      THREADID_LIMIT_CHAR: 'thread tidak valid',
      COMMENTID_LIMIT_CHAR: 'komentar tidak valid',
    },
  },
  DELETE_REPLY_USE_CASE: {
    message: 'gagal menghapus balasan',
    description: {
      PAYLOAD_NOT_CONTAIN_NEEDED_PROPERTY: 'data yang dibutuhkan tidak lengkap',
      PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION: 'tipe data tidak sesuai',
    },
  },
};

module.exports = DomainErrorTranslator;
