import { Navigate, Route, Routes } from "react-router-dom";
import { DocsLayout } from "./layout";
import { ButtonPage } from "./pages";
import { ComponentReferencePage } from "./pages/ComponentReferencePage";
import { HomePage } from "./pages/home";
import {
  ComponentStatusPage,
  InstallationPage,
  TokensPage,
} from "./pages/foundations";

export function App() {
  return (
    <Routes>
      <Route element={<DocsLayout />}>
        <Route index element={<HomePage />} />
        <Route path="foundations/installation" element={<InstallationPage />} />
        <Route path="foundations/tokens" element={<TokensPage />} />
        <Route path="foundations/status" element={<ComponentStatusPage />} />
        <Route
          path="components/card"
          element={<ComponentReferencePage forcedSlug="card" />}
        />
        <Route path="components/button" element={<ButtonPage />} />
        <Route path="components/:slug" element={<ComponentReferencePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
