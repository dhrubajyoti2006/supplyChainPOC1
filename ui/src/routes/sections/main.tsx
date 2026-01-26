import { Suspense } from "react";
import { MainLayout } from "../../layouts/main";
import { SplashScreen } from "../../components/SplashScreen";
import HomePage from "../../pages/home";
import MaterialFlowPage from "../../pages/material-flow";
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
            path: "materialflow",
            element: <MaterialFlowPage />
          }
        ]
      }
    ]
  }
];
