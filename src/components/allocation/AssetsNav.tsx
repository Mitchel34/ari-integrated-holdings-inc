'use client';

import { ASSET_KEYS } from '@/lib/allocation';
import { scrollToSection, useScrollSpy } from '@/lib/useScrollSpy';
import { AllocationRing } from './AllocationRing';

/**
 * The allocation ring as page navigation for /assets: the highlighted slice
 * follows the section being read, and selecting a slice scrolls to its section.
 */
export function AssetsNav() {
    const { active } = useScrollSpy(ASSET_KEYS);

    return (
        <AllocationRing
            layout="stacked"
            showPoints={false}
            showLink={false}
            activeKey={ASSET_KEYS[active]}
            onSelect={scrollToSection}
        />
    );
}
