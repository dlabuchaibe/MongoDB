const config = {
    server: {
        port: 80
    },
    db: {
        host: 'cluster0-4rayt.mongodb.net',
        name: 'db_twitter',
        user: 'twitter',
        password: 'twitter_user'
    },
    weatherApiKey:'ca684dfccee70c9b47f45029164a4a75',
    saltRounds: 10,
    tokenKey: "my-secret-key"
}
module.exports = config;