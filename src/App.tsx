import { BrowserRouter, Routes, Route } from "react-router-dom";
import BrandPortalLayout from "@/layouts/BrandPortalLayout";
import Dashboard from "@/pages/Dashboard";
import CampaignsList from "@/pages/campaigns/CampaignsList";
import CreateCampaign from "@/pages/campaigns/CreateCampaign";
import CampaignDetail from "@/pages/campaigns/CampaignDetail";
import Creators from "@/pages/Creators";
import Messages from "@/pages/Messages";
import BrandSettings from "@/pages/BrandSettings";

export default function App() {
  return (
    <BrowserRouter basename="/vibe-coding-Brand-Project-1-repo">
      <Routes>
        <Route element={<BrandPortalLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/campaigns" element={<CampaignsList />} />
          <Route path="/campaigns/create" element={<CreateCampaign />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<BrandSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
