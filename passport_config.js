const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs');

function initializeE(passport, getUserByEmail, getUserByID) {
	const authenticationUser = async (email, password, done) => {
		const user = await getUserByEmail(email);
		if (user == null) {
			return done(null, false, {
				message:
					"Il n'y a pas d'utilisateur avec cette adressse courriel. ",
			});
		}
		try {
<<<<<<< HEAD
			if (bcrypt.compare(password,user.password)) {
=======
			if (await bcrypt.compare(password, user.password)) {
>>>>>>> parent of 7945abd (commit module file part 4)
				return done(null, user);
			} else {
				return done(null, false, {
					message: "Mot de passe incorrect !",
				});
			}
		} catch (err) {
			
			console.log("connexion success");
			return done(e);
		}
	};

	passport.use(
		new LocalStrategy({ usernameField: "email" }, authenticationUser)
	);
	passport.serializeUser((user, done) => done(null, user.id));
	passport.deserializeUser(async (id, done) => {
<<<<<<< HEAD
		console.log("id all good");
=======
		console.log("L'utilisateur est validé");
>>>>>>> parent of 7945abd (commit module file part 4)
		return done(null, await id);
	});
}

module.exports = initializeE;