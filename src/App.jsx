import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/query";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import Error from "./pages/Error";
import { ToastContainer } from "react-toastify";
import Loading from "./components/Loading/Loading";
import SearchProvider from "./store/SearchProvider";

const ProtectedRoute = lazy(() => import("./components/ProtectedRoute/ProtectedRoute"));
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Explore = lazy(() => import("./pages/Explore"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Messages = lazy(() => import("./pages/Messages"));
const Lists = lazy(() => import("./pages/Lists"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const Jobs = lazy(() => import("./pages/Jobs"));
const Communities = lazy(() => import("./pages/Communities"));
const Premium = lazy(() => import("./pages/Premium"));
const VerifiedOrgs = lazy(() => import("./pages/VerifiedOrgs"));
const Profile = lazy(() => import("./pages/Profile"));
const More = lazy(() => import("./pages/More"));

export default function App() {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: (
          <Suspense fallback={<Loading />}>
            <MainLayout />
          </Suspense>
        ),
        errorElement: <Error />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loading />}>
                <ProtectedRoute>
                  <Navigate to="/home" />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: "/home",
            element: (
              <Suspense fallback={<Loading />}>
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: "/explore",
            element: (
              <Suspense fallback={<Loading />}>
                <ProtectedRoute>
                  <Explore />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: "/notifications",
            element: (
              <Suspense fallback={<Loading />}>
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: "/messages",
            element: (
              <Suspense fallback={<Loading />}>
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: "/lists",
            element: (
              <Suspense fallback={<Loading />}>
                <ProtectedRoute>
                  <Lists />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: "/bookmarks",
            element: (
              <Suspense fallback={<Loading />}>
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: "/jobs",
            element: (
              <Suspense fallback={<Loading />}>
                <ProtectedRoute>
                  <Jobs />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: "/communities",
            element: (
              <Suspense fallback={<Loading />}>
                <ProtectedRoute>
                  <Communities />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: "/premium",
            element: (
              <Suspense fallback={<Loading />}>
                <ProtectedRoute>
                  <Premium />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: "/verifiedOrgs",
            element: (
              <Suspense fallback={<Loading />}>
                <ProtectedRoute>
                  <VerifiedOrgs />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: "/:displayName",
            element: (
              <Suspense fallback={<Loading />}>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </Suspense>
            ),
          },
          {
            path: "/more",
            element: (
              <Suspense fallback={<Loading />}>
                <ProtectedRoute>
                  <More />
                </ProtectedRoute>
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        ),
      },
    ],
    {
      basename: "/x",
    }
  );

  return (
    <>
      <ToastContainer theme="dark" position="bottom-right" />
      <QueryClientProvider client={queryClient}>
        <SearchProvider>
          <RouterProvider router={router} />
        </SearchProvider>
      </QueryClientProvider>
    </>
  );
}
