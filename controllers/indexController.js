const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const User = require("../models/user");
const Message = require("../models/message");

/*------------------------- GET controllers ----------- */
exports.home = function (req, res, next) {
	Message.find()
		.populate("author")
		.sort([["date", "ascending"]])
		.exec(function (err, message_list) {
			if (err) {
				return next(err);
			}
			res.render("index", { title: "Elbahri club", message_list });
		});
};
exports.member = function (req, res) {
	if (!req.user || req.user.membership != "user") {
		res.redirect("/");
	}
	res.render("member", { title: "Become a Member" });
};
exports.admin = function (req, res) {
	if (!req.user || req.user.membership != "member") {
		res.redirect("/");
	}
	res.render("admin", { title: "Become an Admin" });
};
exports.addMessage = function (req, res) {
	if (!req.user) {
		res.redirect("/");
	}
	res.render("message", { title: "Add a Message" });
};
exports.login = function (req, res) {
	if (req.user) {
		res.redirect("/");
	}
	res.render("login", { title: "login" });
};
exports.signup = function (req, res) {
	if (req.user) {
		res.redirect("/");
	}
	res.render("signup", { title: "signup" });
};
exports.delete = function (req, res, next) {
	Message.findByIdAndRemove(req.params.id, {}, function (err) {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
};
exports.logout = function (req, res) {
	req.logout();
	res.redirect("/");
};

/*----------------POST controllers -------------------*/
exports.login_post = function (req, res, next) {
	passport.authenticate("local", function (err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.render("login", { title: "login", message: "authentication failed" });
		}
		req.login(user, (loginErr) => {
			if (loginErr) {
				return next(loginErr);
			}
			return res.redirect("/");
		});
	})(req, res, next);
};

exports.signup_post = [
	body("username")
		.trim()
		.isAlpha()
		.withMessage("Username must only have alphabitcal characters & no space")
		.isLength({ min: 5 })
		.withMessage("Username must at least have 5 characters"),
	body("username").custom(async (value) => {
		const user = await User.find({ username: value });
		if (user.length != 0) {
			return Promise.reject("username already Exists");
		}
	}),
	body("password").isLength({ min: 6 }).withMessage("Password should atleast have 6 characters"),
	body("password-confirm", "Password confirmation does not match password")
		.exists()
		.custom((value, { req }) => value === req.body.password),
	function (req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.render("signup", { title: "signup", errors: errors.errors });
		} else {
			bcrypt.hash(req.body.password, 15, (err, hashedPassword) => {
				// if err, do something
				if (err) {
					return next(err);
				}
				// otherwise, store hashedPassword in DB
				const user = new User({
					username: req.body.username,
					password: hashedPassword,
					membership: "user",
				}).save((err) => {
					if (err) {
						return next(err);
					}
					res.redirect("/");
				});
			});
		}
	},
];

exports.addMessage_post = [
	body("title")
		.trim()
		.isAlphanumeric("en-US", { ignore: " -" })
		.withMessage("Title must have alphabitical or numurical values only ")
		.isLength({ min: 15 })
		.withMessage("Title must at least have 15 characters"),
	body("message").isLength({ min: 30 }).withMessage("message should atleast have 30 characters"),
	function (req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log(errors.errors);
			res.render("message", { title: "Add a Message", errors: errors.errors });
		} else {
			const message = new Message({
				title: req.body.title,
				body: req.body.message,
				author: req.user._id,
			}).save((err) => {
				if (err) {
					return next(err);
				}
				res.redirect("/");
			});
		}
	},
];

exports.admin_post = function (req, res, next) {
	if (req.body.admin === "admin") {
		User.findByIdAndUpdate(req.user._id, { membership: "admin" }, {}, function (err) {
			if (err) {
				return next(err);
			}
			res.redirect("/");
		});
	}
	res.render("admin", { title: "Become an admin", message: "Wrong admin password" });
};

exports.member_post = function (req, res, next) {
	if (req.body.member === "member") {
		User.findByIdAndUpdate(req.user._id, { membership: "member" }, {}, function (err) {
			if (err) {
				return next(err);
			}
			res.redirect("/");
		});
	}
	res.render("member", { title: "Become a member", message: "Wrong member password" });
};
