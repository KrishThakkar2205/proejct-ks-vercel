import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="bg-white min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bebas tracking-wide font-bold text-deep-black mb-4">
                        Terms & Conditions
                    </h1>
                    <p className="text-medium-gray italic">Last Updated: 04 Feb 2026</p>
                </div>

                <div className="prose prose-lg max-w-none text-deep-black leading-relaxed">
                    <p className="mb-8 bg-warm-cream/30 p-6 rounded-2xl border border-light-gray">
                        These Terms & Conditions govern access to and use of the Influrunner platform. By accessing our website or services, you agree to these terms.
                    </p>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-deep-black mb-4 border-l-4 border-primary-orange pl-4">
                            1. Platform Overview
                        </h2>
                        <p className="mb-2">Influrunner is a technology platform that connects:</p>
                        <ul className="list-disc pl-6 space-y-1 text-medium-gray mb-4">
                            <li>Influencers who share verified social media data</li>
                            <li>Brands seeking influencer insights and reach analytics</li>
                        </ul>
                        <p className="font-semibold text-primary-orange italic">
                            Influrunner does not guarantee partnerships, earnings, or campaign success.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-deep-black mb-4 border-l-4 border-primary-orange pl-4">
                            2. User Eligibility
                        </h2>
                        <p className="mb-2">By using the platform, you confirm that:</p>
                        <ul className="list-disc pl-6 space-y-1 text-medium-gray">
                            <li>You are at least 18 years old</li>
                            <li>You have the legal right to connect social media accounts</li>
                            <li>All information provided is accurate and lawful</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-deep-black mb-4 border-l-4 border-primary-orange pl-4">
                            3. Social Media Account Linking
                        </h2>
                        <p className="mb-2">Users may voluntarily connect their social media accounts through official APIs. By doing so, you:</p>
                        <ul className="list-disc pl-6 space-y-1 text-medium-gray">
                            <li>Grant permission to access authorized data</li>
                            <li>Confirm ownership or legal access to the account</li>
                            <li>Acknowledge that permissions can be revoked anytime</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-deep-black mb-4 border-l-4 border-primary-orange pl-4">
                            4. Acceptable Use
                        </h2>
                        <p className="mb-2">Users agree NOT to:</p>
                        <ul className="list-disc pl-6 space-y-1 text-medium-gray mb-4">
                            <li>Misuse platform data</li>
                            <li>Attempt unauthorized access</li>
                            <li>Upload false or misleading information</li>
                            <li>Violate third-party platform policies</li>
                        </ul>
                        <p className="font-semibold text-red-500">
                            Violation may result in account suspension or termination.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-deep-black mb-4 border-l-4 border-primary-orange pl-4">
                            5. Intellectual Property
                        </h2>
                        <p className="text-medium-gray">
                            All platform content including software, design, logos, and data presentation is the intellectual property of Influrunner Technologies LLP and may not be copied without written permission.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-deep-black mb-4 border-l-4 border-primary-orange pl-4">
                            6. Limitation of Liability
                        </h2>
                        <p className="mb-2 text-medium-gray">Influrunner is not liable for:</p>
                        <ul className="list-disc pl-6 space-y-1 text-medium-gray mb-4">
                            <li>Inaccurate third-party data</li>
                            <li>Social media API downtime</li>
                            <li>Business losses or missed opportunities</li>
                            <li>Actions taken based on displayed analytics</li>
                        </ul>
                        <p className="bg-light-gray p-4 rounded-xl border border-gray-200 font-mono text-sm">
                            The platform is provided “as-is”.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-deep-black mb-4 border-l-4 border-primary-orange pl-4">
                            7. Account Termination
                        </h2>
                        <p className="mb-4 text-medium-gray">We reserve the right to:</p>
                        <ul className="list-disc pl-6 space-y-1 text-medium-gray mb-4">
                            <li>Suspend or terminate accounts for policy violations</li>
                            <li>Remove access without prior notice if misuse is detected</li>
                        </ul>
                        <p className="text-medium-gray italic">
                            Users may also request account deletion at any time.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-deep-black mb-4 border-l-4 border-primary-orange pl-4">
                            8. Governing Law
                        </h2>
                        <div className="bg-light-gray p-6 rounded-2xl border border-gray-200">
                            <p className="text-medium-gray mb-2">These Terms are governed by the laws of India.</p>
                            <p className="font-bold text-deep-black">Jurisdiction: Ahmedabad, Gujarat</p>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-deep-black mb-4 border-l-4 border-primary-orange pl-4">
                            9. Contact Us
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

export default TermsAndConditions;
