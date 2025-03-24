import { useContext, useRef, useState } from "react";
import { SearchContext } from "../store/searchContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../store/authContext";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../components/Loading/Loading";

export default function Explore() {
	const { searchQuery, setSearchQuery } = useContext(SearchContext);
	const { user, auth } = useContext(AuthContext);
	const queryClient = useQueryClient();
	const [selectedTweet, setSelectedTweet] = useState(null);
	const [selectedTweetForDeletion, setSelectedTweetForDeletion] =
		useState(null);
	const [replyToTweet, setReplyToTweet] = useState(null);
	const replyTextRef = useRef("");

	const fetchTweets = async () => {
		// API publique, pas besoin de token pour la lecture
		const tweetsResponse = await fetch(
			`https://passerelle-x-default-rtdb.europe-west1.firebasedatabase.app/tweets.json`
		);
		const tweets = await tweetsResponse.json();
		if (!tweets) {
			return [];
		}
		return Object.keys(tweets).map((key) => ({
			id: key,
			...tweets[key],
		}));
	};

	const { data: tweets, isLoading } = useQuery({
		queryKey: ["tweets"],
		queryFn: fetchTweets,
		staleTime: 10000,
	});

	const handleDeleteTweet = async (tweetId) => {
		try {
			const token = await auth.currentUser.getIdToken(true);
			const response = await fetch(
				`https://passerelle-x-default-rtdb.europe-west1.firebasedatabase.app/tweets/${tweetId}.json?auth=${token}`,
				{
					method: "DELETE",
				}
			);

			if (response.ok) {
				await queryClient.invalidateQueries(["tweets"]);
				toast.success("Tweet supprimé !");
			}
		} catch (error) {
			toast.error("Erreur lors de la suppression du tweet : " + error.message);
		}
	};

	const handleReply = async (e, tweetId) => {
		e.preventDefault();
		e.stopPropagation();

		if (
			!replyTextRef.current.value.trim() ||
			replyTextRef.current.value.length > 280
		) {
			toast.error("La réponse doit contenir entre 1 et 280 caractères");
			return;
		}

		const reply = {
			content: replyTextRef.current.value,
			date: new Date().toISOString(),
			userId: user.uid,
			displayName: user.displayName,
			replyTo: tweetId,
		};

		try {
			const token = await auth.currentUser.getIdToken(true);
			const response = await fetch(
				`https://passerelle-x-default-rtdb.europe-west1.firebasedatabase.app/tweets.json?auth=${token}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(reply),
				}
			);

			if (response.ok) {
				setReplyToTweet(null);
				replyTextRef.current.value = "";
				await queryClient.invalidateQueries(["tweets"]);
				toast.success("Réponse publiée !");
			}
		} catch (error) {
			toast.error(
				"Erreur lors de la publication de la réponse : " + error.message
			);
		}
	};

	const getReplyCount = (tweetId) => {
		return tweets?.filter((tweet) => tweet.replyTo === tweetId).length || 0;
	};

	const getTweetReplies = (tweetId) => {
		return tweets
			?.filter((tweet) => tweet.replyTo === tweetId)
			.sort((a, b) => new Date(a.date) - new Date(b.date));
	};

	// Filtre les tweets selon la recherche
	const filteredTweets = tweets?.filter((tweet) => {
		const searchLower = searchQuery.toLowerCase();
		const matchesSearch =
			tweet.content.toLowerCase().includes(searchLower) ||
			tweet.displayName.toLowerCase().includes(searchLower);
		const isNotReply = !tweet.replyTo;
		return matchesSearch && isNotReply;
	});

	if (isLoading) return <Loading />;

	return (
		<div className="w-full grid grid-cols-1 auto-rows-max basis-1/2">
			<div className="p-4">
				<div className="flex">
					<input
						type="search"
						id="search"
						autoComplete="off"
						className="w-full bg-slate-700 text-white rounded-full px-4 py-3 ps-10 text-sm outline-none border-none focus:outline-[#1D9BF0] focus:outline-offset-0 focus:outline-1 transition-colors duration-200"
						placeholder="Chercher"
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<div className="absolute ps-3 pt-3">
						<svg
							className="w-4 h-4 text-gray-500"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 20 20">
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
							/>
						</svg>
					</div>
				</div>
			</div>

			<AnimatePresence mode="wait">
				{selectedTweet ? (
					// Vue détaillée d'un tweet
					<motion.div
						key="tweet-detail"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.2 }}
						className="col-span-1">
						<button
							onClick={() => setSelectedTweet(null)}
							className="p-4 hover:bg-slate-800 text-white">
							← Retour
						</button>
						<div className="border-t border-slate-700">
							{/* Tweet principal */}
							<div className="p-4 border-b border-slate-700">
								<div className="flex items-start gap-3">
									<NavLink to={`/${selectedTweet.displayName}`}>
										<img
											src={`https://i.pravatar.cc/150?u=${selectedTweet.displayName}`}
											alt="avatar"
											className="w-12 h-12 rounded-full"
										/>
									</NavLink>
									<div className="w-full">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<span className="font-bold">
													{selectedTweet.displayName}
												</span>
												<span className="text-gray-500 text-sm">
													{new Date(selectedTweet.date).toLocaleDateString()}
												</span>
											</div>
											{user && user.uid === selectedTweet.userId && (
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleDeleteTweet(selectedTweet.id);
														setSelectedTweet(null);
													}}
													className="text-red-500 hover:text-red-700 text-sm">
													Supprimer
												</button>
											)}
										</div>
										<p className="mt-2">{selectedTweet.content}</p>
									</div>
								</div>
							</div>

							{/* Zone de réponse */}
							{user && (
								<div className="p-4 border-b border-slate-700">
									<form
										onSubmit={(e) => handleReply(e, selectedTweet.id)}
										className="flex items-start gap-3">
										<NavLink to={`/${user.displayName}`}>
											<img
												src={`https://i.pravatar.cc/150?u=${user.displayName}`}
												alt="avatar"
												className="w-12 h-12 rounded-full"
											/>
										</NavLink>
										<div className="w-full">
											<textarea
												ref={replyTextRef}
												className="w-full mt-2 text-white rounded-lg border-none outline-none bg-transparent resize-none font-medium text-lg"
												placeholder="Postez votre réponse"
												rows={2}
											/>
											<div className="flex justify-end border-t border-slate-700 border-collapse">
												<button
													type="submit"
													className="px-4 py-2 bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white rounded-full font-bold mt-3">
													Répondre
												</button>
											</div>
										</div>
									</form>
								</div>
							)}

							{/* Réponses au tweet */}
							{getTweetReplies(selectedTweet.id).map((reply) => (
								<div
									key={reply.id}
									className="p-4 border-b border-slate-700 hover:bg-slate-800"
									onMouseEnter={() => setSelectedTweetForDeletion(reply.id)}
									onMouseLeave={() => setSelectedTweetForDeletion(null)}>
									<div className="flex items-start gap-3">
										<NavLink to={`/${reply.displayName}`}>
											<img
												src={`https://i.pravatar.cc/150?u=${reply.displayName}`}
												alt="avatar"
												className="w-12 h-12 rounded-full"
											/>
										</NavLink>
										<div className="w-full">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<span className="font-bold">{reply.displayName}</span>
													<span className="text-gray-500 text-sm">
														{new Date(reply.date).toLocaleDateString()}
													</span>
												</div>
												{user &&
													user.uid === reply.userId &&
													selectedTweetForDeletion === reply.id && (
														<button
															onClick={(e) => {
																e.stopPropagation();
																handleDeleteTweet(reply.id);
															}}
															className="text-red-500 hover:text-red-700 text-sm">
															Supprimer
														</button>
													)}
											</div>
											<p className="mt-2">{reply.content}</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</motion.div>
				) : (
					// Liste des tweets
					<motion.div key="tweet-list" className="border-t border-slate-700">
						{!filteredTweets || filteredTweets.length === 0 ? (
							<div className="p-4 text-center text-gray-400">
								<p>
									{searchQuery
										? "Aucun tweet ne correspond à votre recherche."
										: "Aucun tweet n'a été publié pour le moment."}
								</p>
								{searchQuery && <p>Essayez avec d&apos;autres mots-clés!</p>}
							</div>
						) : (
							filteredTweets
								?.slice()
								.reverse()
								.map((tweet) => (
									<motion.div
										key={tweet.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3 }}
										whileHover={{
											backgroundColor: "rgba(255, 255, 255, 0.03)",
											transition: { duration: 0.1 },
										}}
										className="cursor-pointer border-solid border-y border-slate-700 border-collapse p-4"
										onClick={() => setSelectedTweet(tweet)}
										onMouseEnter={() => setSelectedTweetForDeletion(tweet.id)}
										onMouseLeave={() => setSelectedTweetForDeletion(null)}>
										<div className="flex items-start gap-3">
											<NavLink to={`/${tweet.displayName}`}>
												<img
													src={`https://i.pravatar.cc/150?u=${tweet.displayName}`}
													alt="avatar"
													className="w-12 h-12 rounded-full"
												/>
											</NavLink>
											<div className="w-full">
												<div className="flex items-center gap-2">
													<span className="font-bold">{tweet.displayName}</span>
													<span className="text-gray-500 text-sm">
														{new Date(tweet.date).toLocaleDateString()}
													</span>
												</div>
												<p className="mt-2">{tweet.content}</p>
												<div className="flex items-center justify-between mt-2">
													<div
														className="flex items-center gap-1 text-gray-500 group cursor-pointer"
														onClick={(e) => {
															e.stopPropagation();
															setReplyToTweet(tweet.id);
														}}>
														<div className="p-2 rounded-full group-hover:bg-[#1D9BF0] group-hover:bg-opacity-10">
															<ChatBubbleLeftIcon className="h-5 w-5 group-hover:text-[#1D9BF0]" />
														</div>
														<span className="text-sm group-hover:text-[#1D9BF0]">
															{getReplyCount(tweet.id)}
														</span>
													</div>
													{user &&
														user.uid === tweet.userId &&
														selectedTweetForDeletion === tweet.id && (
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	handleDeleteTweet(tweet.id);
																}}
																className="text-red-500 hover:text-red-700 text-sm">
																Supprimer
															</button>
														)}
												</div>
												{replyToTweet === tweet.id && user && (
													<form
														onSubmit={(e) => handleReply(e, tweet.id)}
														onClick={(e) => e.stopPropagation()}
														className="mt-2 border-t border-slate-700 pt-2">
														<textarea
															ref={replyTextRef}
															className="w-full bg-transparent text-white rounded p-2 border border-slate-700"
															placeholder="Votre réponse"
															rows={2}
														/>
														<div className="flex justify-end gap-2 mt-2">
															<button
																type="button"
																onClick={(e) => {
																	e.stopPropagation();
																	setReplyToTweet(null);
																}}
																className="px-4 py-1 text-gray-400 hover:text-white">
																Annuler
															</button>
															<button
																type="submit"
																className="px-4 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600">
																Répondre
															</button>
														</div>
													</form>
												)}
											</div>
										</div>
									</motion.div>
								))
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
