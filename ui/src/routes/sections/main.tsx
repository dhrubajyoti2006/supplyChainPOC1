import { Suspense } from "react";
import { MainLayout } from "../../layouts/main";
import { SplashScreen } from "../../components/SplashScreen";
import GraphPage from "../../pages/graph";
import GraphDetailPage from "../../pages/graph-detail";
import AreaScanManagementPage from "../../pages/area-scan-management";
import AreaScanInitiatePage from "../../pages/area-scan/initiate";
import AreaScanResultsPage from "../../pages/area-scan/results";
import ContextualResearchPage from "../../pages/contextual-research";
import DiscoveryEvaluationPage from "../../pages/area-scan/evaluation";
import AIPromptPage from "../../pages/ai-prompt";
import WebsiteArtifactPage from "../../pages/website-artifact";
import OutreachControlPage from "../../pages/outreach-control";
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
            path: "area-scan/results",
            element: <AreaScanResultsPage />
          },
          {
            path: "area-scan/evaluation/:placeId?",
            element: <DiscoveryEvaluationPage />
          },
          {
            path: "contextual-research/:placeId?",
            element: <ContextualResearchPage />
          },
          {
            path: "ai-prompt",
            element: <AIPromptPage />
          },
          {
            path: "website-artifact",
            element: <WebsiteArtifactPage />
          },
          {
            path: "outreach-control",
            element: <OutreachControlPage />
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
