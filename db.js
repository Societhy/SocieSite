var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

var state = {
  db: null,
}

var databaseAPI = {
    connect: function(url, done) {
        if (state.db)
            return done()
        MongoClient.connect(url, function(err, db) {
            if (err)
                return done(err)
            state.db = db
            done()
        })
    },

    getDb: function() {
        return state.db
    },

    close: function (done) {
        if (state.db){
            state.db.close(function(err, result){
                assert(err, null)
                state.db = null
                done(result)
            })
        }
    },

    // fill database for test purpose
    fillDatabase: function() {
        var user1 = {"addresses":["0x00000001", "0x0000000a"], "firstname":"user1", "lastname":"user1", "mail":"u@1.com", "photo":null, "listOrga":[], "transHisto":[], "infos":[]}
        var user2 = {"addresses":["0x00000002", "0x0000000b"], "firstname":"user2", "lastname":"user2", "mail":"u@2.com", "photo":null, "listOrga":[], "transHisto":[], "infos":[]}
        var user3 = {"addresses":["0x00000003", "0x0000000c"], "firstname":"user3", "lastname":"user3", "mail":"u@3.com", "photo":null, "listOrga":[], "transHisto":[], "infos":[]}
        var user4 = {"addresses":["0x00000004", "0x0000000d"], "firstname":"user4", "lastname":"user4", "mail":"u@4.com", "photo":null, "listOrga":[], "transHisto":[], "infos":[]}
        var user5 = {"addresses":["0x00000005", "0x0000000e"], "firstname":"user5", "lastname":"user5", "mail":"u@5.com", "photo":null, "listOrga":[], "transHisto":[], "infos":[]}
        var user6 = {"addresses":["0x00000006", "0x0000000f"], "firstname":"user6", "lastname":"user6", "mail":"u@6.com", "photo":null, "listOrga":[], "transHisto":[], "infos":[]}
        var user7 = {"addresses":["0x00000007", "0x00000010"], "firstname":"user7", "lastname":"user7", "mail":"u@7.com", "photo":null, "listOrga":[], "transHisto":[], "infos":[]}
        var user8 = {"addresses":["0x00000008", "0x00000011"], "firstname":"user8", "lastname":"user8", "mail":"u@8.com", "photo":null, "listOrga":[], "transHisto":[], "infos":[]}
        var user9 = {"addresses":["0x00000009", "0x00000012"], "firstname":"user9", "lastname":"user9", "mail":"u@9.com", "photo":null, "listOrga":[], "transHisto":[], "infos":[]}

        var MSF = {"name":"Medecins Sans Frontiere", "memberList":[], "transHisto":[], "actualities":[]}
        var CR = {"name":"Croix Rouge", "memberList":[], "transHisto":[], "actualities":[]}
        var ACLF = {"name":"Action contre la faim", "memberList":[], "transHisto":[], "actualities":[]}

        databaseAPI.existUser(user1, databaseAPI.insertNewUser)
        databaseAPI.existUser(user2, databaseAPI.insertNewUser)
        databaseAPI.existUser(user3, databaseAPI.insertNewUser)
        databaseAPI.existUser(user4, databaseAPI.insertNewUser)
        databaseAPI.existUser(user5, databaseAPI.insertNewUser)
        databaseAPI.existUser(user6, databaseAPI.insertNewUser)
        databaseAPI.existUser(user7, databaseAPI.insertNewUser)
        databaseAPI.existUser(user8, databaseAPI.insertNewUser)
        databaseAPI.existUser(user9, databaseAPI.insertNewUser)

        databaseAPI.existOrga(ACLF, databaseAPI.insertNewOrga)
        databaseAPI.existOrga(CR, databaseAPI.insertNewOrga)
        databaseAPI.existOrga(MSF, databaseAPI.insertNewOrga)
    },

    getUserByAddress: function(addr, userCallback) {
        console.log("Searching user for addr:", addr)
        var addrNonSensitive = new RegExp(["^", addr, "$"].join(""), "i")

        var userCursor = state.db.collection('users').find({'addresses': addrNonSensitive})
        userCursor.hasNext(function (err, user) {
            assert.equal(err, null)
            userCursor.next(function (err, user) {
                userCallback(user)
            })
        })
    },

    insertNewUser: function (newUser) {
        console.log("Insertion of new user.")

        state.db.collection('users').insertOne(newUser, function(err, result) {
            assert.equal(err, null)
            console.log("Inserted new user in users collection.")
        })
    },

    existUser: function (newUser, callback) {
        console.log("Searching user from db.")
        var cursor = state.db.collection('users').find({'addresses':newUser.addresses})

        cursor.count(function(err, nb){
            assert.equal(err, null)
            if (nb != 0){
                console.log("User already exists.")
            } else {
                callback(newUser)
            }
        })
    },

    getOrgaByName : function (name, orgaCallback) {
        console.log("Searching orga for name:", name)
        var nameNonSensitive = new RegExp(["^", name, "$"].join(""), "i")

        var orgaCursor = state.db.collection('orga').find({'name': nameNonSensitive})
        orgaCursor.hasNext(function (err, orga) {
            assert.equal(err, null)
            orgaCursor.next(function (err, orga) {
                orgaCallback(orga)
            })
        })
    },

    insertNewOrga : function (newOrga) {
        console.log("Insertion of new orga.")

        state.db.collection('orga').insertOne(newOrga, function(err, result) {
            assert.equal(err, null)
            console.log("Inserted new orga in orga collection.")
        })
    },

    existOrga : function (newOrga, callback) {
        console.log("Searching orga from db.")
        var cursor = state.db.collection('orga').find({'name':newOrga.name})

        cursor.count(function(err, nb){
            assert.equal(err, null)
            if (nb != 0) {
                console.log("Orga already exists.")
            } else {
                callback(newOrga)
            }
        })
    },

    addOrgaToUserListOrga : function(newUser, newOrga) {
        console.log("Adding", newOrga.name, "to list orga for", newUser.address)

        state.db.collection('users').updateOne({'addresses':newUser.addresses}, {$addToSet: {'listOrga': newOrga.name}}, function (err, result) {
            assert.equal(err, null)
        })
    },

    addUserToOrgaMemberList : function(newOrga, newUser) {
        console.log("Adding", newUser.addresses, "to list member for", newOrga.name)

        state.db.collection('orga').updateOne({'name':newOrga.name}, {$addToSet : {memberList: {'user': newUser.addresses, 'right': {'admin':true, 'proposeDonation':true}}}}, function (err, result) {
            assert.equal(err, null)
        })
    },

    userJoinOrga : function (newUser, newOrga) {
        var userCursor = state.db.collection('users').find({'addresses':newUser.addresses})

        userCursor.count(function (err, nb) {
            assert.equal(err, null)
            if (nb != 0){
                console.log("User exists")

                var orgaCursor = state.db.collection('orga').find({'name':newOrga.name})
                orgaCursor.count(function (err, nb) {
                    assert.equal(err, null)
                    if (nb != 0){
                        console.log("Orga exists")

                        databaseAPI.addOrgaToUserListOrga(newUser, newOrga)
                        databaseAPI.addUserToOrgaMemberList(newOrga, newUser)
                    } else {
                        console.log("Orga doesn't exists")
                    }
                })
            } else {
                console.log("User doesn't exists")
            }
        })
    },
}

module.exports = databaseAPI

// var db = require('./db')
// var url = 'mongodb://localhost:27017/test'

// db.connect(url, function (err) {
//     if (err){
//         console.log('Unable to connect to Mongo.')
//         process.exit(1)
//     } else {
//         console.log('Connected to db');
//         db.fillDatabase();
//         db.getOrgaByName('croix rouge', function(orga) {
//             console.log(orga);
//         });
//         db.getUserByAddress('0x00000004', function(user) {
//             console.log(user);
//         });
//         app.use(function(req,res,next){
//             req.db = db;
//             next();
//         });
//     }
// })
