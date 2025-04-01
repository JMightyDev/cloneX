import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useContext, useRef, useState, useEffect } from "react"; // Ajoutez useEffect
import { AuthContext } from "../store/authContext";
import LogoX from "../components/LogoX/LogoX";
import { getAuth, updateProfile } from "firebase/auth";
import Loading from "../components/Loading/Loading";
import { motion, AnimatePresence } from "framer-motion"; // Ajouter l'import

// Page de création de compte de X.com
export default function Login() {
	// Variables
	const { createUser, loginUser, user } = useContext(AuthContext);

	// States
	const [loading, setLoading] = useState(false);
	const [loginPopup, setLoginPopup] = useState(false);

	// Refs
	const emailLoginRef = useRef(null);
	const passwordLoginRef = useRef(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const {
		register: registerLogin,
		handleSubmit: handleSubmitLogin,
		formState: { errors: errorsLogin },
	} = useForm();

	// Déplacer les deux useEffect ici, avant les conditions de retour
	useEffect(() => {
		if (loginPopup) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [loginPopup]);

	useEffect(() => {
		const handleEscape = (event) => {
			if (event.key === "Escape") {
				setLoginPopup(false);
			}
		};

		if (loginPopup) {
			document.addEventListener("keydown", handleEscape);
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [loginPopup]);

	if (loading) {
		return <Loading />;
	}

	const onRegisterSubmit = async (data) => {
		if (loading) return <Loading />;
		setLoading(true);

		try {
			await createUser(data.email, data.password);
			await updateProfile(getAuth().currentUser, {
				displayName: data.displayName,
			});
			toast.success(`Bienvenue ${data.displayName}!`);
		} catch (error) {
			const { code, message } = error;
			if (code === "auth/email-already-in-use") {
				toast.error("Cette adresse e-mail est déjà utilisée.");
			} else {
				toast.error(message);
			}
		}
		setLoading(false);
		return <Navigate to="/home" />;
	};

	const onLoginSubmit = async (data) => {
		if (loading) return;
		setLoading(true);

		try {
			const userCredential = await loginUser(
				data.emailLogin,
				data.passwordLogin
			);
			setLoading(false);
			toast.success(`Enfin de retour ${getAuth().currentUser.displayName}!`);
		} catch (error) {
			setLoading(false);
			const { code, message } = error;
			if (code === "auth/user-not-found") {
				toast.error("Aucun utilisateur trouvé avec cette adresse e-mail.");
			} else if (code === "auth/wrong-password") {
				toast.error("Le mot de passe est incorrect.");
			} else if (code === "auth/invalid-credential") {
				toast.error(
					"Les informations d'identification fournies sont incorrectes."
				);
			} else if (code === "auth/too-many-requests") {
				toast.error("Trop de tentatives. Réessayez plus tard.");
			} else if (code === "auth/user-disabled") {
				toast.error("Cet utilisateur a été désactivé.");
			} else if (code === "auth/invalid-email") {
				toast.error("Adresse e-mail invalide.");
			} else if (code === "auth/weak-password") {
				toast.error("Le mot de passe doit contenir au moins 6 caractères.");
			} else {
				toast.error(`Erreur de connexion: ${message}`);
			}
		}
	};

	if (user) {
		return <Navigate to="/home" />;
	}

	return (
		<>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="flex items-center pt-5 md:pt-20 flex-wrap justify-evenly h-screen">
				<motion.div
					initial={{ scale: 0.8 }}
					animate={{ scale: 1 }}
					transition={{ duration: 0.5 }}
					className="flex items-center w-full justify-center md:w-auto md:justify-normal">
					<LogoX width="w-20 sm:w-36 md:w-64 lg:w-96" />
				</motion.div>
				<div className="flex items-center">
					<div className="flex flex-col items-center space-y-3 w-full">
						<motion.span
							initial={{ y: -20 }}
							animate={{ y: 0 }}
							className="text-4xl md:text-[64px] font-chirpbold leading-tight text-center max-w-[450px]">
							Ça se passe maintenant
						</motion.span>
						<motion.h2
							initial={{ x: -20, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ delay: 0.2 }}
							className="pt-6 pb-3 text-[31px] font-chirpbold tracking-widest">
							Inscrivez-vous.
						</motion.h2>
						<form
							onSubmit={handleSubmit(onRegisterSubmit)}
							className="flex flex-col space-y-4 w-80 text-black">
							<motion.input
								whileFocus={{ scale: 1.02 }}
								transition={{ type: "spring", stiffness: 300 }}
								type="text"
								placeholder="Pseudo"
								autoFocus
								className={`p-3 border ${
									errors.displayName ? "border-red-500" : "border-gray-300"
								} rounded h-10 outline-none focus:border-[#1D9BF0] focus:ring-1 focus:ring-[#1D9BF0]`}
								{...register("displayName", {
									required: "Le pseudo est requis",
									minLength: {
										value: 3,
										message: "Le pseudo doit contenir au moins 3 caractères",
									},
									maxLength: {
										value: 50,
										message: "Le pseudo doit contenir au maximum 50 caractères",
									},
									pattern: {
										value: /^[a-zA-Z0-9_]+$/,
										message:
											"Le pseudo ne doit contenir que des lettres, chiffres et underscores",
									},
								})}
							/>
							{errors.displayName && (
								<motion.p
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="text-red-500 text-sm mt-1">
									{errors.displayName.message}
								</motion.p>
							)}
							<motion.input
								whileFocus={{ scale: 1.02 }}
								transition={{ type: "spring", stiffness: 300 }}
								type="email"
								placeholder="Adresse email"
								autoComplete="email"
								className={`p-3 border ${
									errors.email ? "border-red-500" : "border-gray-300"
								} rounded h-10 outline-none focus:border-[#1D9BF0] focus:ring-1 focus:ring-[#1D9BF0]`}
								{...register("email", {
									required: "L'adresse email est requise",
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
										message: "Veuillez entrer une adresse email valide",
									},
								})}
							/>
							{errors.email && (
								<motion.p
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="text-red-500 text-sm mt-1">
									{errors.email.message}
								</motion.p>
							)}
							<motion.input
								whileFocus={{ scale: 1.02 }}
								transition={{ type: "spring", stiffness: 300 }}
								type="password"
								placeholder="Mot de passe"
								autoComplete="current-password"
								className={`p-3 border ${
									errors.password ? "border-red-500" : "border-gray-300"
								} rounded h-10 outline-none focus:border-[#1D9BF0] focus:ring-1 focus:ring-[#1D9BF0]`}
								{...register("password", {
									required: "Le mot de passe est requis",
									minLength: {
										value: 8,
										message:
											"Le mot de passe doit contenir au moins 8 caractères",
									},
									maxLength: {
										value: 50,
										message:
											"Le mot de passe doit contenir au maximum 50 caractères",
									},
									pattern: {
										value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
										message:
											"Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre",
									},
								})}
							/>
							{errors.password && (
								<motion.p
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="text-red-500 text-sm mt-1">
									{errors.password.message}
								</motion.p>
							)}
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								type="submit"
								className="px-4 py-2 bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white rounded-full font-bold transition-colors duration-200">
								Créer un compte
							</motion.button>
							<div className="text-xs w-80 text-[#8B98A5]">
								En vous inscrivant, vous acceptez les{" "}
								<Link to="#" className="text-[#1D9BF0]">
									Conditions d&apos;utilisation
								</Link>{" "}
								et la{" "}
								<Link to="#" className="text-[#1D9BF0]">
									Politique de confidentialité
								</Link>
								, notamment l&apos;
								<Link to="#" className="text-[#1D9BF0]">
									Utilisation des cookies
								</Link>
								.
							</div>
						</form>
						<div>
							<motion.h3
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.4 }}
								className="mt-16 mb-4 font-chirpbold tracking-wider text-center">
								Vous avez déjà un compte ?
							</motion.h3>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setLoginPopup(true)}
								className="p-2 bg-[#15202B] hover:bg-[#162D3F] text-[#1D9BF0] rounded-full font-bold block text-center border border-white border-opacity-30 w-80">
								Se connecter
							</motion.button>
						</div>
					</div>
				</div>
				{/* Footer avec animation */}
				<motion.div
					initial={{ y: 50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.6 }}
					className="flex flex-wrap space-x-5 justify-around items-center w-screen h-16 mt-20 text-[#8B98A5] text-xs px-12">
					<Link className="hover:underline">À propos</Link>
					<Link className="hover:underline">
						Téléchargez l&apos;application X
					</Link>
					<Link className="hover:underline">Centre d&apos;assistance</Link>
					<Link className="hover:underline">Conditions d&apos;utilisation</Link>
					<Link className="hover:underline">Politique de Confidentialité</Link>
					<Link className="hover:underline">
						Politique relative aux cookies
					</Link>
					<Link className="hover:underline">Accessibilité</Link>
					<Link className="hover:underline">
						Informations sur les publicités
					</Link>
					<Link className="hover:underline">Blog</Link>
					<Link className="hover:underline">Carrières</Link>
					<Link className="hover:underline">Ressources de la marque</Link>
					<Link className="hover:underline">Publicité</Link>
					<Link className="hover:underline">Marketing</Link>
					<Link className="hover:underline">X pour les professionnels</Link>
					<Link className="hover:underline">Développeurs</Link>
					<Link className="hover:underline">Répertoire</Link>
					<Link className="hover:underline">Paramètres</Link>

					<Link to="https://jmighty.fr" className="hover:underline">
						© 2024 JMighty.fr | Ce clone de X.com a été créé uniquement à des
						fins éducatives dans le cadre d&apos;une formation. Aucune
						utilisation commerciale n&apos;est prévue ni envisagée. Tous les
						droits appartiennent à X Corp. Cette reproduction pédagogique
						n&apos;a pas vocation à porter atteinte à la marque X et sera
						retirée sur simple demande des ayants droit.
					</Link>
				</motion.div>
			</motion.div>

			{/* Loading */}
			{loading ? (
				<div className="fixed inset-0 bg-[#15202b] bg-opacity-50 flex justify-center items-center">
					<LogoX />
				</div>
			) : null}

			{/* Login Popup avec animations */}
			<AnimatePresence>
				{loginPopup && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[2px]"
							onClick={() => setLoginPopup(false)}
						/>
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.8, opacity: 0 }}
							transition={{ type: "spring", bounce: 0.3 }}
							className="fixed inset-0 flex items-center justify-center"
							onClick={(e) => e.stopPropagation()}>
							<motion.div
								className="bg-[#15202B] p-8 py-12 rounded-2xl w-[600px] max-w-[90vw] mx-auto"
								initial={{ y: -50 }}
								animate={{ y: 0 }}
								exit={{ y: -50 }}
								transition={{ type: "spring", damping: 20 }}>
								{/* Le reste du contenu de la popup reste inchangé */}
								<div className="text-center mb-8">
									<motion.div
										animate={{
											scale: [1, 1.2, 1],
										}}
										transition={{
											duration: 0.5,
										}}>
										<LogoX width="w-12" />
									</motion.div>
								</div>
								<form
									onSubmit={handleSubmitLogin(onLoginSubmit)}
									className="flex flex-col space-y-5 w-full max-w-sm mx-auto">
									<motion.input
										whileFocus={{ scale: 1.02 }}
										transition={{ type: "spring", stiffness: 300 }}
										type="email"
										placeholder="Adresse email"
										autoComplete="email"
										autoFocus
										ref={emailLoginRef}
										className={`p-4 md:p-3 bg-white border ${
											errorsLogin.emailLogin ? "border-red-500" : "border-none"
										} rounded-lg h-12 md:h-10 text-base w-full outline-none focus:border-[#1D9BF0] focus:ring-1 focus:ring-[#1D9BF0] text-black`}
										{...registerLogin("emailLogin", {
											required: "L'adresse email est requise",
											pattern: {
												value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
												message: "Veuillez entrer une adresse email valide",
											},
										})}
									/>
									{errorsLogin.emailLogin && (
										<motion.p
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											className="text-red-500 text-sm mt-1">
											{errorsLogin.emailLogin.message}
										</motion.p>
									)}
									<motion.input
										whileFocus={{ scale: 1.02 }}
										transition={{ type: "spring", stiffness: 300 }}
										type="password"
										placeholder="Mot de passe"
										autoComplete="current-password"
										ref={passwordLoginRef}
										className={`p-4 md:p-3 bg-white border ${
											errorsLogin.passwordLogin
												? "border-red-500"
												: "border-none"
										} rounded-lg h-12 md:h-10 text-base w-full outline-none focus:border-[#1D9BF0] focus:ring-1 focus:ring-[#1D9BF0] text-black`}
										{...registerLogin("passwordLogin", {
											required: "Le mot de passe est requis",
											minLength: {
												value: 8,
												message:
													"Le mot de passe doit contenir au moins 8 caractères",
											},
										})}
									/>
									{errorsLogin.passwordLogin && (
										<motion.p
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											className="text-red-500 text-sm mt-1">
											{errorsLogin.passwordLogin.message}
										</motion.p>
									)}
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										type="submit"
										className="px-4 py-2 bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white rounded-full font-bold transition-colors duration-200">
										Se connecter
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										type="button"
										onClick={() => setLoginPopup(false)}
										className="p-4 md:p-2 bg-[#EFF3F4] hover:bg-[#D7DBDC] text-[#0F1419] rounded-full font-bold text-lg w-full">
										Annuler
									</motion.button>
								</form>
							</motion.div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
