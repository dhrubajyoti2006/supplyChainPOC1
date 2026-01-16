import { Suspense } from "react";
import { MainLayout } from "../../layouts/main";
import { SplashScreen } from "../../components/SplashScreen";
import GraphPage from "../../pages/graph";
import GraphDetailPage from "../../pages/graph-detail";
import HomePage from "../../pages/home";
import { Outlet } from "react-router-dom";

export const mainRoutes = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        element: (
          <MainLayout>
            <Outlet />
          </MainLayout>
        ),
        children: [
          {
            path: "",
            children: [{ element: <HomePage />, index: true }]
          },
          {
            path: "home",
            element: <HomePage />
          },
          {
            path: "graph",
            element: <GraphPage />
          },
          {
            path: "graph/:id",
            element: <GraphDetailPage />
          }
        ]
      }
    ]
  }
];
