import { Suspense } from "react";
import { MainLayout } from "../../layouts/main";
import { SplashScreen } from "../../components/SplashScreen";
import GraphPage from "../../pages/graph";
import GraphDetailPage from "../../pages/graph-detail";
import AreaScanManagementPage from "../../pages/area-scan-management";
import AreaScanInitiatePage from "../../pages/area-scan/initiate";
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
            children: [{ element: <AreaScanManagementPage />, index: true }]
          },
          {
            path: "home",
            element: <AreaScanManagementPage />
          },
          {
            path: "area-scan/new",
            element: <AreaScanInitiatePage />
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
