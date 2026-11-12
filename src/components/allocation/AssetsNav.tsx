'use client';

import { ASSET_KEYS } from '@/lib/site';
import { scrollToSection, useScrollSpy } from '@/lib/useScrollSpy';
import { AllocationExplorer } from '@/components/brand/AllocationExplorer';

/**
 * The allocation ring as page navigation for /assets: the highlighted slice
 * follows the section being read, and selecting a slice or chip scrolls to
 * its section.
 */
export function AssetsNav() {
    const { active } = useScrollSpy(ASSET_KEYS);

    return (
        <AllocationExplorer
            layout="stacked"
            size={220}
            showPoints={false}
            showLink={false}
            activeKey={ASSET_KEYS[active]}
            onSelect={scrollToSection}
            transitionName="allocation-ring"
        />
    );
}
