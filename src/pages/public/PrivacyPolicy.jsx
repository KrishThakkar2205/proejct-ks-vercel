import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="bg-white min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bebas tracking-wide font-bold text-deep-black mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-medium-gray italic">Last Updated: 04 Feb 2026</p>
                </div>

                <div className="prose prose-lg max-w-none text-deep-black leading-relaxed">
                    <p className="mb-8 bg-warm-cream/30 p-6 rounded-2xl border border-light-gray">
                        Influrunner Technologies LLP (“Influrunner”, “we”, “our”, “us”) is committed to protecting the privacy of users (“you”, “your”) who access or use our platform. This Privacy Policy explains how we collect, use, store, and protect personal information when you use our website and services.
                    </p>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-deep-black mb-4 border-l-4 border-primary-orange pl-4">
                            1. Information We Collect
                        </h2>
                        <p className="mb-4">We may collect the following categories of information:</p>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-deep-black mb-2">a) Personal Information:</h3>
                                <ul className="list-disc pl-6 space-y-1 text-medium-gray">
                                    <li>Name</li>
                                    <li>Email address</li>
                                    <li>Contact details</li>
                                    <li>Account login credentials</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-deep-black mb-2">b) Social Media Account Data (Via APIs):</h3>
                                <p className="mb-2">When users connect their social media accounts (such as Instagram, Facebook, or YouTube), we may access:</p>
                                <ul className="list-disc pl-6 space-y-1 text-medium-gray">
                                    <li>Public profile information</li>
                                    <li>Follower count and reach metrics</li>
                                    <li>Engagement metrics (likes, comments, views)</li>
                                    <li>Recent posts or content (e.g., last 10 posts/reels)</li>
                                </ul>
                                <p className="mt-2 text-sm italic text-medium-gray">
                                    *Note: We only access data that users explicitly authorize via official APIs.*
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-deep-black mb-4 border-l-4 border-primary-orange pl-4">
                            2. Purpose of Data Collection
                        </h2>
                        <p className="mb-4">We collect and use data strictly for the following purposes:</p>
                        <ul className="list-disc pl-6 space-y-2 text-medium-gray">
                            <li>To display influencer analytics and reach insights</li>
                            <li>To help brands evaluate influencer performance</li>
                            <li>To improve platform features and user experience</li>
                            <li>To comply with legal and regulatory requirements</li>
                        </ul>
                        <p className="mt-4 font-semibold text-primary-orange">
                            *We do NOT sell, rent, or misuse user data.*
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-deep-black mb-4 border-l-4 border-primary-orange pl-4">
                            3. Use of Meta & Third-Party APIs
                        </h2>
                        <p className="mb-4">
                            Influrunner integrates official APIs provided by Meta Platforms, Inc. (Instagram & Facebook) and Google (YouTube). Data obtained via these APIs is:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-medium-gray">
                            <li>Used only within the Influrunner platform</li>
                            <li>Displayed only to authorized users</li>
                            <li>Never stored beyond permitted scope</li>
                            <li>Never used for advertising or resale</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-deep-black mb-4 border-l-4 border-primary-orange pl-4">
                            4. Data Storage & Security
                        </h2>
                        <p className="text-medium-gray">
                            We implement industry-standard security practices including secure servers, encrypted connections, access controls, and regular monitoring. However, no system is 100% secure, and users share data at their own discretion.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-deep-black mb-4 border-l-4 border-primary-orange pl-4">
                            5. Data Sharing
                        </h2>
                        <p className="text-medium-gray">
                            We may share data only with user consent, to comply with legal obligations, or with service providers under strict confidentiality. We do not share personal or social data with unauthorized third parties.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-deep-black mb-4 border-l-4 border-primary-orange pl-4">
                            6. User Rights
                        </h2>
                        <p className="text-medium-gray">
                            Users have the right to access their data, revoke social media permissions at any time, or request account and data deletion. Requests can be sent to: <a href="mailto:business@influrunner.com" className="text-primary-orange hover:underline font-semibold">business@influrunner.com</a>.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-deep-black mb-4 border-l-4 border-primary-orange pl-4">
                            7. Data Retention
                        </h2>
                        <p className="text-medium-gray">
                            We retain user data only as long as necessary to provide services, fulfill legal obligations, or resolve disputes.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-deep-black mb-4 border-l-4 border-primary-orange pl-4">
                            8. Changes to This Policy
                        </h2>
                        <p className="text-medium-gray">
                            We may update this Privacy Policy periodically. Continued use of the platform implies acceptance of updated terms.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-deep-black mb-4 border-l-4 border-primary-orange pl-4">
                            9. Contact Information
                        </h2>
                        <div className="bg-light-gray p-6 rounded-2xl border border-gray-200">
                            <p className="font-bold text-deep-black mb-2">Influrunner Technologies LLP</p>
                            <p className="text-medium-gray flex flex-col gap-1">
                                <span><strong>Email:</strong> <a href="mailto:business@influrunner.com" className="hover:text-primary-orange transition-colors">business@influrunner.com</a></span>
                                <span><strong>Website:</strong> <a href="https://influrunner.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-orange transition-colors">https://influrunner.com</a></span>
                            </p>
                        </div>
                    </section>

                    <div className="pt-8 border-t border-light-gray text-center text-medium-gray text-sm">
                        <p>© 2026 InfluRunner Technologies LLP. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
