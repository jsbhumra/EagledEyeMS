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

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		// fields: [
		// 	"_id",
		// 	"name",
		// 	"quantity",
		// 	"price"
		// ],

		// Validator for the `create` & `insert` actions.
		// entityValidator: {
		// 	name: "string|min:3",
		// 	price: "number|positive"
		// }
	},

	/**
	 * Action Hooks
	 */
	hooks: {
		// before: {
		// 	/**
		// 	 * Register a before hook for the `create` action.
		// 	 * It sets a default value for the quantity field.
		// 	 *
		// 	 * @param {Context} ctx
		// 	 */
		// 	create(ctx) {
		// 		ctx.params.quantity = 0;
		// 	}
		// }
	},

	/**
	 * Actions
	 */
	actions: {
		/**
		 * The "moleculer-db" mixin registers the following actions:
		 *  - list
		 *  - find
		 *  - count
		 *  - create
		 *  - insert
		 *  - update
		 *  - remove
		 */

		// --- ADDITIONAL ACTIONS ---

		/**
		 * Increase the quantity of the product item.
		 */
		addUser: {
			rest: "POST /signup",
			params: {
				fname: "string",
				username: "string",
				email: "string",
				password: "string",
				// profilePic: "string",
				// role: "string"
			},
			/** @param {Context} ctx */
			async handler(ctx) {

					const existingUser1 = await this.adapter.find({query: { email: ctx.params.email }});
					if (existingUser1.length!=0) throw new MoleculerError('This email already has an account!',400);
					
					const existingUser2 = await this.adapter.find({query: { username: ctx.params.username }});
					if (existingUser2.length!=0) throw new MoleculerError('Username taken!',400);
				try{

					const hashedPassword = await bcrypt.hash(ctx.params.password, 12);
					// const student = new Student({ fullName, email, password: hashedPassword });

					const doc = await this.adapter.insert({
						fname: ctx.params.fname,
						username: ctx.params.username,
						email: ctx.params.email,
						password: hashedPassword,
						// role: ctx.params.role
					});
					// const json = await this.transformDocuments(ctx, ctx.params, doc);
					// await this.entityChanged("updated", json, ctx);

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
				// const json = await this.transformDocuments(ctx, ctx.params, doc);
				// await this.entityChanged("updated", json, ctx);

				return doc;
			}
		},

		getUser: {
			rest: "GET /me",
			// params: {
			// 	authToken: "string"
			// },
			async handler(ctx) {
				const valid = await auth(ctx.meta.authToken);
				if(valid.status!=200) throw new MoleculerError(valid.message,400)
				return(valid.message);
				// const doc = await this.adapter.find()

				// return doc
			}
		},

		/**
		 * Decrease the quantity of the product item.
		 */
		// decreaseQuantity: {
		// 	rest: "PUT /:id/quantity/decrease",
		// 	params: {
		// 		id: "string",
		// 		value: "number|integer|positive"
		// 	},
		// 	/** @param {Context} ctx  */
		// 	async handler(ctx) {
		// 		const doc = await this.adapter.updateById(ctx.params.id, { $inc: { quantity: -ctx.params.value } });
		// 		const json = await this.transformDocuments(ctx, ctx.params, doc);
		// 		await this.entityChanged("updated", json, ctx);

		// 		return json;
		// 	}
		// }
	},

	/**
	 * Methods
	 */
	methods: {
		/**
		 * Loading sample data to the collection.
		 * It is called in the DB.mixin after the database
		 * connection establishing & the collection is empty.
		 */
		// async seedDB() {
		// 	await this.adapter.insertMany([
		// 		{ name: "Samsung Galaxy S10 Plus", quantity: 10, price: 704 },
		// 		{ name: "iPhone 11 Pro", quantity: 25, price: 999 },
		// 		{ name: "Huawei P30 Pro", quantity: 15, price: 679 },
		// 	]);
		// }
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	}
};
