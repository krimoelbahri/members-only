const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const User = require("../models/user");

exports.home = function (req, res, next) {
	res.render("index", { title: "Elbahri club", messages_list: [] });
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
	res.render("signup", { title: "signup", errors: [] });
};

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
			res.render("signup", { title: "login", errors: errors.errors });
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

exports.logout = function (req, res) {
	req.logout();
	res.redirect("/");
};
