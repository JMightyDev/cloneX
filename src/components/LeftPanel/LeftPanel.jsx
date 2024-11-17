import { NavLink, useLocation } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import LogoX from ".././LogoX/LogoX";
import { HomeIcon as HomeSolid } from "@heroicons/react/24/solid";
import { HomeIcon as HomeOutline } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon as SearchSolid } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon as SearchOutline } from "@heroicons/react/24/outline";
import { BellIcon as BellSolid } from "@heroicons/react/24/solid";
import { BellIcon as BellOutline } from "@heroicons/react/24/outline";
import { EnvelopeIcon as EnvelopeIconSolid } from "@heroicons/react/24/solid";
import { EnvelopeIcon as EnvelopeIconOutline } from "@heroicons/react/24/outline";
import { QueueListIcon as QueueListSolid } from "@heroicons/react/24/solid";
import { QueueListIcon as QueueListOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import { BookmarkIcon as BookmarkOutline } from "@heroicons/react/24/outline";
import { BriefcaseIcon as BriefcaseSolid } from "@heroicons/react/24/solid";
import { BriefcaseIcon as BriefcaseOutline } from "@heroicons/react/24/outline";
import { UserGroupIcon as UserGroupSolid } from "@heroicons/react/24/solid";
import { UserGroupIcon as UserGroupOutline } from "@heroicons/react/24/outline";
import { BoltIcon as BoltSolid } from "@heroicons/react/24/solid";
import { BoltIcon as BoltOutline } from "@heroicons/react/24/outline";
import { UserIcon as UserSolid } from "@heroicons/react/24/solid";
import { UserIcon as UserOutline } from "@heroicons/react/24/outline";
import { EllipsisHorizontalCircleIcon as EllipsisHorizontalCircleIconSolid } from "@heroicons/react/24/solid";
import { EllipsisHorizontalCircleIcon as EllipsisHorizontalCircleIconOutline } from "@heroicons/react/24/outline";
import LeftPanelItem from "./LeftPanelItem/LeftPanelItem";
import { toast } from "react-toastify";
import { AuthContext } from "../../store/authContext";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

export default function LeftPanel() {
  const queryClient = useQueryClient();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const actualPath = useLocation().pathname;
  const refTextArea = useRef("");
  const { user } = useContext(AuthContext);

  // Définir les éléments de navigation mobile
  const mobileNavItems = [
    { to: "/home", Icon: HomeSolid, OutIcon: HomeOutline },
    { to: "/explore", Icon: SearchSolid, OutIcon: SearchOutline },
    { to: "/notifications", Icon: BellSolid, OutIcon: BellOutline },
    { to: "/messages", Icon: EnvelopeIconSolid, OutIcon: EnvelopeIconOutline },
    { to: "/communities", Icon: UserGroupSolid, OutIcon: UserGroupOutline },
    {
      to: user ? `/${user.displayName}` : "/profile",
      Icon: UserSolid,
      OutIcon: UserOutline,
    },
  ];

  // Définir les éléments de navigation desktop (garder la liste complète existante)
  const desktopNavItems = [
    { to: "/home", Icon: HomeSolid, OutIcon: HomeOutline, text: "Accueil" },
    { to: "/explore", Icon: SearchSolid, OutIcon: SearchOutline, text: "Explorer" },
    {
      to: "/notifications",
      Icon: BellSolid,
      OutIcon: BellOutline,
      text: "Notifications",
    },
    {
      to: "/messages",
      Icon: EnvelopeIconSolid,
      OutIcon: EnvelopeIconOutline,
      text: "Messages",
    },
    { to: "/lists", Icon: QueueListSolid, OutIcon: QueueListOutline, text: "Listes" },
    { to: "/bookmarks", Icon: BookmarkSolid, OutIcon: BookmarkOutline, text: "Signets" },
    { to: "/jobs", Icon: BriefcaseSolid, OutIcon: BriefcaseOutline, text: "Emplois" },
    {
      to: "/communities",
      Icon: UserGroupSolid,
      OutIcon: UserGroupOutline,
      text: "Communautés",
    },
    { to: "/premium", Icon: LogoX, OutIcon: LogoX, text: "Premium" },
    {
      to: "/verifiedOrgs",
      Icon: BoltSolid,
      OutIcon: BoltOutline,
      text: "Organisations certi",
    },
    {
      to: user ? "/" + user.displayName : "/profile",
      Icon: UserSolid,
      OutIcon: UserOutline,
      text: "Profil",
    },
    {
      to: "/more",
      Icon: EllipsisHorizontalCircleIconSolid,
      OutIcon: EllipsisHorizontalCircleIconOutline,
      text: "Plus",
    },
  ];

  const onBeforeSubmitHandler = (e) => {
    e.preventDefault();
    let isValid = true;
    // Check if the textarea is empty or has more than 280 characters
    if (
      !refTextArea.current.value ||
      refTextArea.current.value.trim() === "" ||
      refTextArea.current.value.length > 280 ||
      refTextArea.current.value.length < 1
    ) {
      isValid = false;
    }

    if (isValid) {
      postNewTweet();
    } else {
      refTextArea.current.focus();
      toast.error("Le tweet doit contenir entre 1 et 280 caractères", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  const postNewTweet = async () => {
    const newTweet = {
      content: refTextArea.current.value,
      date: new Date().toISOString(),
      userId: user.uid, // ID de l'utilisateur Firebase
      displayName: user.displayName,
    };

    const token = await user.getIdToken();
    const response = await fetch(
      `https://passerelle-x-default-rtdb.europe-west1.firebasedatabase.app/tweets.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTweet),
      }
    );

    if (response.ok) {
      setModalIsOpen(false);
      // Invalidate and refetch
      await queryClient.invalidateQueries(["tweets"]);
      toast.success("Message publié !", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } else {
      toast.error("Une erreur est survenue...", {
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }
  };

  useEffect(() => {
    if (modalIsOpen) {
      // Focus the textarea when the modal is opened
      refTextArea.current.focus();

      // Ajouter l'event listener pour la touche Échap
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          setModalIsOpen(false);
        }
      };
      document.addEventListener("keydown", handleEscape);

      // Nettoyer l'event listener
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [modalIsOpen]);

  return (
    <>
      {/* Version desktop */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="hidden lg:flex h-screen basis-1/4 justify-end">
        <div className="fixed h-screen border-r border-slate-700">
          <div className="p-4 text-white">
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-3">
              <motion.li whileHover={{ scale: 1.1 }} className="flex items-center space-x-2">
                <NavLink
                  to="/home"
                  className="flex items-center space-x-2 rounded-full p-3 hover:bg-slate-700">
                  <LogoX width="w-8" />
                </NavLink>
              </motion.li>

              {/* Animer les items du menu */}
              {desktopNavItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}>
                  <LeftPanelItem
                    isActive={actualPath === item.to}
                    linkTo={item.to}
                    SolidIcon={item.Icon}
                    OutlineIcon={item.OutIcon}
                    text={item.text}
                  />
                </motion.div>
              ))}
            </motion.ul>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="py-4 bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white rounded-full font-bold mt-4 w-full"
              onClick={() => setModalIsOpen(true)}>
              Poster
            </motion.button>
          </div>

          <AnimatePresence>
            {modalIsOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                  onClick={() => setModalIsOpen(false)}
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", bounce: 0.3 }}
                  className="fixed inset-0 flex items-start justify-center pt-20 z-[101]">
                  <motion.div
                    className="bg-[#15202b] p-4 rounded-xl w-[600px]"
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", damping: 20 }}>
                    <motion.button
                      type="button"
                      whileHover={{ rotate: 90 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="hover:bg-slate-500 text-white rounded-full font-bold w-8 h-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalIsOpen(false);
                      }}>
                      X
                    </motion.button>
                    <form onSubmit={(e) => onBeforeSubmitHandler(e)}>
                      <motion.textarea
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="w-full p-2 mt-2 text-white rounded-lg border-none outline-none bg-transparent resize-none font-medium text-lg"
                        placeholder="Quoi de neuf ?!"
                        rows={4}
                        ref={refTextArea}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            onBeforeSubmitHandler(e);
                          }
                        }}
                      />
                      <div className="flex justify-end border-t border-slate-700">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          className="px-4 py-2 bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white rounded-full font-bold mt-3">
                          Poster
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Version mobile */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-slate-700 z-50">
        <div className="flex justify-around items-center p-2">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center p-2 ${isActive ? "text-white" : "text-gray-500"}`
              }>
              {({ isActive }) =>
                isActive ? <item.Icon className="h-6 w-6" /> : <item.OutIcon className="h-6 w-6" />
              }
            </NavLink>
          ))}
        </div>
      </motion.div>
    </>
  );
}
