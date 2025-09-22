import React from 'react';
import Stripe from 'stripe';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import BillingDashboard from './_components/billing-dashboard';

interface SearchParams {
    session_id?: string;
}

interface PageProps {
    searchParams: SearchParams;
}

const getCreditsForTier = (tier: string) => {
    switch (tier) {
        case 'Unlimited':
            return 'Unlimited';
        case 'Pro':
            return '100';
        default:
            return '10';
    }
};

export default async function Page({ searchParams }: PageProps) {
    const session_id = searchParams.session_id;

    if (!session_id) {
        return <BillingDashboard />;
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET!, {
        typescript: true,
        apiVersion: '2025-05-28.basil',
    });

    const session = await stripe.checkout.sessions.listLineItems(session_id);
    const user = await currentUser();
    
    if (!user || !session.data[0]) {
        return <BillingDashboard />;
    }

    const tier = session.data[0].description || 'Free';
    const credits = getCreditsForTier(tier);

    await db.user.upsert({
        where: {
            clerkId: user.id,
        },
        create: {
            clerkId: user.id,
            email: user.emailAddresses[0]?.emailAddress || '',
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            profileImage: user.imageUrl,
            tier,
            credits,
        },
        update: {
            tier,
            credits,
        },
    });

    return (
        <div className='flex flex-col gap-4'>
            <h1 className='sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg'>
                <span>Billing</span>
            </h1>
            <BillingDashboard />
        </div>
    );
}
