process.env.NODE_ENV = "test";

const db = require('pg-bricks').configure(process.env.TEST_DB_URL);
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

describe("Heartbeat", () => {
    it("Checking if server is alive", (done) => {
        chai.request(server)
            .get('/ping')
            .end((err, res) => {
                res.should.have.status(200)
                done()
            })
    })
})

describe("Users", () => {

    beforeEach((done) => {
        db.raw("DELETE FROM POSTS").rows((err,rows) => {
            db.raw("DELETE FROM USERS").rows((err,rows) => {
                done()
            })
        })
    })

    it("POST /users | Should create a new user", (done) => {
        let user = {
            "username": "brando",
            "password": "brando",
            "email": "brando@brando.com",
            "name": "Brandon Danis"
        }

        chai.request(server)
            .post("/users/")
            .send(user)
            .end((err,res) => {
                res.should.have.status(201)
                res.body.should.be.a('object')
                res.body.should.have.property('error')
                res.body.should.have.property('error').eql(false)
                done()
            })
    })

    it("POST /users | Should not create a new user with already existing username", (done) => {
        let user = {
            "username": "brando",
            "password": "brando",
            "email": "brando@brando.com",
            "name": "Brandon Danis"
        }

        db.raw(`INSERT INTO users (name, username, password, email) VALUES ('${user["name"]}', '${user["username"]}', '${user["password"]}', '${user["email"]}')`).rows((err,rows) => {
            should.equal(err, null)
            rows.length.should.be.eql(0)
            chai.request(server)
                .post("/users/")
                .send(user)
                .end((err,res) => {
                    res.should.have.status(500)
                    res.body.should.be.a('object')
                    res.body.should.have.property('error')
                    res.body.should.have.property('error').eql(true)
                    done()
                })
        })
    })

    it("POST /users | Should not create a new user with already existing email", (done) => {
        let user = {
            "username": "brando",
            "password": "brando",
            "email": "brando@brando.com",
            "name": "Brandon Danis"
        }

        db.raw(`INSERT INTO users (name, username, password, email) VALUES ('${user["name"]}', '${user["username"]+"1"}', '${user["password"]}', '${user["email"]}')`).rows((err,rows) => {
            should.equal(err, null)
            rows.length.should.be.eql(0)
            chai.request(server)
                .post("/users/")
                .send(user)
                .end((err,res) => {
                    res.should.have.status(500)
                    res.body.should.be.a('object')
                    res.body.should.have.property('error')
                    res.body.should.have.property('error').eql(true)
                    done()
                })
        })
    })

    it("GET /users/:username | Should give us the users info", (done) => {
        let username = "brando"
        db.raw(`INSERT INTO users (name, username, password, email) VALUES ('${username}', '${username}', '${username}', '${username}@${username}.com')`).rows((err,rows) => {
            should.equal(err, null)
            rows.length.should.be.eql(0)
            chai.request(server)
                .get(`/users/${username}`)
                .end((err,res) => {
                    res.should.have.status(202)
                    res.body.should.be.a('object')
                    res.body.should.have.property('error')
                    res.body.should.have.property('error').eql(false)
                    res.body.should.have.property('data')
                    res.body.data.should.have.property('name')
                    res.body.data.should.have.property('name').eql(`${username}`)
                    res.body.data.should.have.property('username')
                    res.body.data.should.have.property('username').eql(`${username}`)
                    res.body.data.should.have.property('datecreated')
                    res.body.data.should.have.property('description')
                    res.body.data.should.have.property('posts')
                    res.body.data.posts.should.be.a('array')
                    res.body.data.posts.length.should.be.eql(0)
                    done()
                })
        })
    })

})

// "name": "brando",
//     "username": "brando",
//     "datecreated": "2017-03-25T16:03:09.482Z",
//     "description": null,
//     "profile_picture_url": null,
//     "profile_background_url": null,
//     "posts": [

describe("Posts", () => {

    beforeEach((done) => {
        db.raw("DELETE FROM POSTS").rows((err,rows) => {
            db.raw("DELETE FROM USERS").rows((err,rows) => {
                done()
            })
        })
    })

    it("GET /posts", (done) => {
        done()
    })

})
