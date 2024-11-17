import { CalendarIcon } from "@heroicons/react/20/solid";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../store/authContext";
import { toast } from "react-toastify";
import Loading from "../components/Loading/Loading";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query"; // Ajoutez cette ligne

export default function Profile() {
  const { displayName } = useParams();
  const { user, logOut, auth } = useContext(AuthContext);
  const [userTweets, setUserTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [replyToTweet, setReplyToTweet] = useState(null);
  const [selectedTweetForDeletion, setSelectedTweetForDeletion] = useState(null);
  const replyTextRef = useRef("");
  const [selectedTweet, setSelectedTweet] = useState(null);
  const queryClient = useQueryClient(); // Ajoutez cette ligne

  const getReplyCount = (tweetId) => {
    const replies = userTweets.filter((tweet) => tweet.replyTo === tweetId);
    return replies.length;
  };

  const getTweetReplies = (tweetId) => {
    return userTweets
      .filter((tweet) => tweet.replyTo === tweetId)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await auth.currentUser.getIdToken(true);

        // Vérification des abonnements uniquement si on n'est pas sur son propre profil
        if (user && user.displayName !== displayName) {
          const subResponse = await fetch(
            `https://passerelle-x-default-rtdb.europe-west1.firebasedatabase.app/subscriptions/${user.uid}.json?auth=${token}`
          );
          const subscriptions = await subResponse.json();
          setIsSubscribed(subscriptions && Object.values(subscriptions).includes(displayName));
        }
        setSubscriptionLoading(false);

        // Récupérer les tweets de l'utilisateur
        const response = await fetch(
          `https://passerelle-x-default-rtdb.europe-west1.firebasedatabase.app/tweets.json?auth=${token}`
        );
        const allTweets = await response.json();
        if (allTweets) {
          const tweets = Object.entries(allTweets)
            .filter(([, tweet]) => tweet.displayName === displayName)
            .map(([id, tweet]) => ({
              id,
              ...tweet,
            }));
          setUserTweets(tweets);
        }
      } catch (error) {
        toast.error("Erreur lors du chargement des tweets : " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [displayName, user, auth]);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Vous êtes déconnecté!");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion : " + error.message);
    }
  };

  const handleSubscription = async () => {
    if (subscriptionLoading) return;

    setSubscriptionLoading(true);
    try {
      const token = await auth.currentUser.getIdToken(true);
      if (isSubscribed) {
        // Se désabonner
        const response = await fetch(
          `https://passerelle-x-default-rtdb.europe-west1.firebasedatabase.app/subscriptions/${user.uid}.json?auth=${token}`
        );
        const subscriptions = await response.json();
        const subToDelete = Object.keys(subscriptions).find(
          (key) => subscriptions[key] === displayName
        );

        await fetch(
          `https://passerelle-x-default-rtdb.europe-west1.firebasedatabase.app/subscriptions/${user.uid}/${subToDelete}.json?auth=${token}`,
          {
            method: "DELETE",
          }
        );
        toast.success(`Vous n'êtes plus abonné à ${displayName}`);
      } else {
        // S'abonner
        const response = await fetch(
          `https://passerelle-x-default-rtdb.europe-west1.firebasedatabase.app/subscriptions/${user.uid}.json?auth=${token}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(displayName),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to subscribe");
        }
        toast.success(`Vous êtes maintenant abonné à ${displayName}`);
      }
      setIsSubscribed(!isSubscribed);
    } catch (error) {
      toast.error("Une erreur est survenue : " + error.message);
    } finally {
      setSubscriptionLoading(false);
    }
  };

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
        setUserTweets(userTweets.filter((tweet) => tweet.id !== tweetId));
        toast.success("Tweet supprimé !");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression du tweet : " + error.message);
    }
  };

  const handleReply = async (e, tweetId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!replyTextRef.current.value.trim() || replyTextRef.current.value.length > 280) {
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
        const data = await response.json();
        // Mettre à jour les tweets localement
        setUserTweets((prevTweets) => [...prevTweets, { id: data.name, ...reply }]);
        setReplyToTweet(null);
        replyTextRef.current.value = "";
        // Invalider le cache des tweets
        await queryClient.invalidateQueries(["tweets"]);
        toast.success("Réponse publiée !");
      }
    } catch (error) {
      toast.error("Erreur lors de la publication de la réponse : " + error.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full grid grid-cols-1 auto-rows-max basis-1/2">
      <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="p-4">
        <div className="flex items-center space-x-4">
          <img
            src={`https://i.pravatar.cc/150?u=${displayName}`}
            alt="avatar"
            className="w-32 h-32 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <div className="flex gap-2">
              {user && user.displayName === displayName ? (
                <button
                  onClick={handleLogout}
                  className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full">
                  Se déconnecter
                </button>
              ) : (
                <button
                  onClick={handleSubscription}
                  disabled={subscriptionLoading}
                  className={`mt-2 px-4 py-2 ${
                    isSubscribed
                      ? "bg-white text-black hover:bg-gray-200"
                      : "bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white"
                  } rounded-full font-bold`}>
                  {subscriptionLoading ? "..." : isSubscribed ? "Abonné" : "S'abonner"}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center text-gray-400">
          <CalendarIcon className="h-5 w-5 mr-2" />
          <span>
            A rejoint X en{" "}
            {new Date().toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {selectedTweet ? (
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
                  <div className="shrink-0">
                    <img
                      src={`https://i.pravatar.cc/150?u=${selectedTweet.displayName}`}
                      alt="avatar"
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{selectedTweet.displayName}</span>
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
                    <div className="shrink-0">
                      <img
                        src={`https://i.pravatar.cc/150?u=${user.displayName}`}
                        alt="avatar"
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
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
                <motion.div
                  key={reply.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    transition: { duration: 0.1 },
                  }}
                  onMouseEnter={() => setSelectedTweetForDeletion(reply.id)}
                  onMouseLeave={() => setSelectedTweetForDeletion(null)}
                  className="p-4 border-b border-slate-700 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0">
                      <img
                        src={`https://i.pravatar.cc/150?u=${reply.displayName}`}
                        alt="avatar"
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{reply.displayName}</span>
                          <span className="text-gray-500 text-sm">
                            {new Date(reply.date).toLocaleDateString()}
                          </span>
                        </div>
                        {user &&
                          (user.uid === reply.userId || user.displayName === displayName) &&
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
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="tweet-list" className="border-t border-slate-700">
            {userTweets.filter((tweet) => !tweet.replyTo).length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                <p>Aucun tweet n&apos;a été publié pour le moment.</p>
              </div>
            ) : (
              userTweets
                .filter((tweet) => !tweet.replyTo) // Ne montrer que les tweets principaux
                .sort((a, b) => new Date(b.date) - new Date(a.date))
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
                      <div className="shrink-0">
                        <img
                          src={`https://i.pravatar.cc/150?u=${tweet.displayName}`}
                          alt="avatar"
                          className="w-12 h-12 rounded-full"
                        />
                      </div>
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{tweet.displayName}</span>
                            <span className="text-gray-500 text-sm">
                              {new Date(tweet.date).toLocaleDateString()}
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
                        <p className="mt-2">{tweet.content}</p>
                        <div className="flex items-center mt-2">
                          <div className="flex items-center gap-1 text-gray-500 group">
                            <div className="p-2 rounded-full group-hover:bg-[#1D9BF0] group-hover:bg-opacity-10">
                              <ChatBubbleLeftIcon className="h-5 w-5 group-hover:text-[#1D9BF0]" />
                            </div>
                            <span className="text-sm group-hover:text-[#1D9BF0]">
                              {getReplyCount(tweet.id)}
                            </span>
                          </div>
                        </div>
                        {replyToTweet === tweet.id && (
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
                                onClick={() => setReplyToTweet(null)}
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
    </motion.div>
  );
}
