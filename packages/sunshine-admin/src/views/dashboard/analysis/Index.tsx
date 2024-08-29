import { useState } from 'react';

import GrowCard from './components/GrowCard';
import SalesProductPie from './components/SalesProductPie';
import SiteAnalysis from './components/SiteAnalysis';
import VisitRadar from './components/VisitRadar';
import VisitSource from './components/VisitSource';

const Index = () => {
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 1500);

  return (
    <div className="p-4">
      <GrowCard loading={loading} className="enter-y" />
      <SiteAnalysis className="!my-4 enter-y" loading={loading} />
      <div className="md:flex enter-y">
        <VisitRadar className="md:w-1/3 w-full" loading={loading} />
        <VisitSource className="md:w-1/3 !md:mx-4 !md:my-0 !my-4 w-full" loading={loading} />
        <SalesProductPie className="md:w-1/3 w-full" loading={loading} />
      </div>
    </div>
  );
};

export default Index;
