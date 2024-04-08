"use strict";

const DbMixin = require("../mixins/db.mixin");
const Review = require("../models/review");
const { MoleculerError } = require("moleculer").Errors;
const auth = require('../middleware/auth')
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "reviews",
	// version: 1
	/**
	 * Mixins
	 */
	mixins: [DbMixin(Review)],

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

        addReview: {
            rest: "POST /addreview",
            params: {
                title: "string",
                img: "string",
                desc: "string",
                rating: "number",
                country: "string",
                city: "string",
                hotel: "string",
                date: "string",
				score: "number",
				mult: "string"
            },
            // async getSentiment(){
            //     return await fetch('http://jsbhumra.pythonanywhere.com/review?desc='+ctx.params.desc,{
            //         method: 'POST'
            //     })
            // },
            /** @param {Context} ctx */
            async handler(ctx) {
				const valid = await auth(ctx.meta.authToken);
				if(valid.status!=200) throw new MoleculerError(valid.message,403)
				const userId = valid.message._id

                // const newResponse = await getSentiment()
                // const descData = await newResponse.json();
                // var score = descData.score;
                var score = ctx.params.score
                var mult = ctx.params.mult;
                // if(descData.sentiment=='Positive'){
                //     mult="";
                // } else {
                //     mult="- ";
                // }
                var eagScore = mult+score*100+"%";
                const doc = await this.adapter.insert({
                    userId: userId,
                    title: ctx.params.title,
                    dashImg: ctx.params.img,
                    desc: ctx.params.desc,
                    rating: ctx.params.rating,
                    country: ctx.params.country,
                    city: ctx.params.city,
                    hotel: ctx.params.hotel,
                    traveledAt: ctx.params.date,
                    eagleScore: eagScore
                });
				// console.log(doc)
				if(doc){
					console.log('ok')
					try{
						const user = await ctx.call('users.reviewSubmit',{userId:userId,revId:doc._id})
						return {doc,user}
					} catch(err) {
						console.log(err)
						await this.adapter.removeById(doc._id);
						throw new MoleculerError("Failed to submit review", 500);
					}
				} else throw new MoleculerError("Failed", 501);
            }
        },

		getReviews: {
			rest: "GET /getreviews",
			async handler(ctx) {
				const valid = await auth(ctx.meta.authToken);
				if(valid.status!=200) throw new MoleculerError(valid.message,403)

				const doc = await this.adapter.find()
				return doc
			}
		},

		getMyReviews: {
			rest: "GET /getmyreviews",
			async handler(ctx) {
				const valid = await auth(ctx.meta.authToken);
				if(valid.status!=200) throw new MoleculerError(valid.message,403)
				const userId = valid.message._id

				const doc = await this.adapter.find({query: { userId: userId }})
				return doc
			}
		},

		getReview: {
			rest: "POST /getreview",
			params: {
				id: "string"
			},
			async handler(ctx) {
				const valid = await auth(ctx.meta.authToken);
				if(valid.status!=200) throw new MoleculerError(valid.message,403)

				const doc = await this.adapter.find({query: { _id: ctx.params.id }})
				return doc[0]
			}
		},

		likeUnlike: {
			rest: "POST /likeunlike",
			params: {
				id: "string"
			},
			/** @param {Context} ctx */
			async handler(ctx){
				try{
					const valid = await auth(ctx.meta.authToken);
					if(valid.status!=200) throw new MoleculerError(valid.message,403)
					const userId = valid.message._id

					const doc1 = await this.adapter.find({query: {_id: ctx.params.id}})
					console.log(doc1)
					const doc = doc1[0]
					console.log(doc)
					if(doc.upvotes.includes(userId)){
						const rev = await this.adapter.updateById(ctx.params.id, {$pull: {upvotes: userId}})

						return rev
					} else {
						const rev = await this.adapter.updateById(ctx.params.id, {$push: {upvotes: userId}})

						return rev
					}
				}catch(err){
					throw new MoleculerError(err)
				}
			}
		}

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
