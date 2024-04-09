"use strict";

const DbMixin = require("../mixins/db.mixin");
const User = require("../models/user");
const { MoleculerError } = require("moleculer").Errors;
const auth = require('../middleware/auth')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "users",
	// version: 1
	/**
	 * Mixins
	 */
	mixins: [DbMixin(User)],

	settings: {

	},

	hooks: {

	},

	actions: {

		// --- ADDITIONAL ACTIONS ---

		addUser: {
			rest: "POST /signup",
			params: {
				fname: "string",
				username: "string",
				email: "string",
				password: "string",
			},
			/** @param {Context} ctx */
			async handler(ctx) {

					const existingUser1 = await this.adapter.find({query: { email: ctx.params.email }});
					if (existingUser1.length!=0) throw new MoleculerError('This email already has an account!',400);
					
					const existingUser2 = await this.adapter.find({query: { username: ctx.params.username }});
					if (existingUser2.length!=0) throw new MoleculerError('Username taken!',400);
				try{

					const hashedPassword = await bcrypt.hash(ctx.params.password, 12);

					const doc = await this.adapter.insert({
						fname: ctx.params.fname,
						username: ctx.params.username,
						email: ctx.params.email,
						password: hashedPassword,
					});

					return ({message: 'Signup successful!'});
				} catch(err){
					throw new MoleculerError(err);
				}
			}
		},

		loginUser: {
			rest: "POST /login",
			params: {
				email: "string",
				password: "string",
			},
			/** @param {Context} ctx */
			async handler(ctx) {
				const student1 = await this.adapter.find({query: { email: ctx.params.email }});
				const student=student1[0];
				if (!student) throw new MoleculerError('Invalid email or password',400);

				console.log(student)

				const isPasswordValid = await bcrypt.compare(ctx.params.password, student.password);
				if (!isPasswordValid) throw new MoleculerError('Invalid email or password',400);

				console.log("pwValid: ",isPasswordValid)

				try{
					const token = jwt.sign({ userId: student._id }, 'your_secret_key');
					return({"x-auth-token": token});
				}catch(err){
					throw new MoleculerError(err);
				}

			}
		},

		reviewSubmit: {
			rest: "POST /writereview",
			params: {
				userId: "string",
				revId: "string"
			},
			/** @param {Context} ctx */
			async handler(ctx) {

				const doc = await this.adapter.updateById(ctx.params.userId, {
					$push: {
						reviews: ctx.params.revId,
					}
				});

				return doc;
			}
		},

		getUser: {
			rest: "GET /me",
			async handler(ctx) {
				const valid = await auth(ctx.meta.authToken);
				if(valid.status!=200) throw new MoleculerError(valid.message,400)
				return(valid.message);
			}
		},

		updateProfile: {
			rest: "POST /update",
			params: {
				img: "string",
			},
			/** @param {Context} ctx */
			async handler(ctx) {
				const valid = await auth(ctx.meta.authToken);
				if(valid.status!=200) throw new MoleculerError(valid.message,400)
				const userId = valid.message._id

				const doc = await this.adapter.updateById(userId, {
						profilePic: ctx.params.img,
				});

				return doc;
			}
		},

	},

	methods: {

	},

	async afterConnected() {
		
	}
};
