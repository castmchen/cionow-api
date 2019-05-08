export default {
  mongo: {
    uri: 'mongodb://cionowdb.documents.azure.com:10255/cionow',
    user: 'cionowdb',
    password:
      'VmXato1h3XlYpvUq425FG99xv9jbzRscQB3fWSLFAwOuR00WqoCVi1D34Qua18YOy90WG2MeKGHM7P73bVBhyw==',
    extra: '?ssl=true&replicaSet=globaldb&sslverifycertificate=false'
  },
  mongo_local: {
    uri: 'mongodb://localhost:27017/cionow',
    user: '',
    password: '',
    extra: ''
  }
};
