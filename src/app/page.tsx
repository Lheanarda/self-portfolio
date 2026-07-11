import { PortfolioPage } from "@/components/layout/PortfolioPage/PortfolioPage";
import { portfolioConfig } from "@/data/portfolio";

export default function Home() {
  return <PortfolioPage config={portfolioConfig} />;
}
