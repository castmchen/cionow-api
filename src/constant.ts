export default {
  mongo: {
    uri: 'mongodb://cionowdb.documents.azure.com:10255/cionowdb',
    user: 'cionowdb',
    password:
      '5zuwsQTD0iE9D46WQkQSpykW2KafeRcgulxiLqNbCERgsxoZNbDDXYB3Xfm7B7jsc8IqvxmA2yghQXiirP5CeA==',
    extra: '?ssl=true&replicaSet=globaldb&sslverifycertificate=false'
  },
  mongo_local: {
    uri: 'mongodb://localhost:27017/cionow',
    user: '',
    password: '',
    extra: ''
  }
};
