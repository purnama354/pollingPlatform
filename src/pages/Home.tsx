import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"

export function Home() {
    const { theme, toggleTheme } = useTheme()

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
                {/* Animated background */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 -left-4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                    <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>

                <div className="relative container mx-auto px-4 py-20 lg:py-32">
                    <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                            Create Engaging Polls<br />
                            <span className="text-white/90">Get Instant Insights</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                            The modern polling platform for gathering opinions, making decisions, and engaging your community in real-time.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Link
                                to="/register"
                                className="btn btn-lg bg-white text-indigo-600 hover:bg-white/90 border-none shadow-xl hover:scale-105 transition-transform gap-2"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                    />
                                </svg>
                                Get Started Free
                            </Link>
                            <Link
                                to="/login"
                                className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-indigo-600 hover:border-white gap-2"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                    />
                                </svg>
                                Sign In
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12">
                            <div className="glass-card rounded-2xl p-6 backdrop-blur-lg">
                                <div className="text-4xl font-bold">1000+</div>
                                <div className="text-white/80 mt-1">Active Polls</div>
                            </div>
                            <div className="glass-card rounded-2xl p-6 backdrop-blur-lg">
                                <div className="text-4xl font-bold">50K+</div>
                                <div className="text-white/80 mt-1">Votes Cast</div>
                            </div>
                            <div className="glass-card rounded-2xl p-6 backdrop-blur-lg">
                                <div className="text-4xl font-bold">5K+</div>
                                <div className="text-white/80 mt-1">Users</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path
                            fill="currentColor"
                            fillOpacity="1"
                            d="M0,128L48,144C96,160,192,192,288,192C384,192,480,160,576,149.3C672,139,768,149,864,165.3C960,181,1056,203,1152,197.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                            className="text-base-200"
                        />
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-base-200">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 animate-fade-in">
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-4">
                            Why Choose Us?
                        </h2>
                        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                            Everything you need to create, share, and analyze polls with ease
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="glass-card rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="text-5xl mb-4">⚡</div>
                            <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
                            <p className="text-base-content/70">
                                Create and launch polls in seconds. No complex setup required.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="glass-card rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <div className="text-5xl mb-4">📊</div>
                            <h3 className="text-2xl font-bold mb-3">Real-Time Results</h3>
                            <p className="text-base-content/70">
                                Watch votes come in live with beautiful animated charts.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="glass-card rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <div className="text-5xl mb-4">🎨</div>
                            <h3 className="text-2xl font-bold mb-3">Beautiful Design</h3>
                            <p className="text-base-content/70">
                                Modern, clean interface with light and dark themes.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="glass-card rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <div className="text-5xl mb-4">🔒</div>
                            <h3 className="text-2xl font-bold mb-3">Secure & Private</h3>
                            <p className="text-base-content/70">
                                Your data is protected with enterprise-grade security.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="glass-card rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                            <div className="text-5xl mb-4">📱</div>
                            <h3 className="text-2xl font-bold mb-3">Mobile Friendly</h3>
                            <p className="text-base-content/70">
                                Fully responsive design works perfectly on any device.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="glass-card rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                            <div className="text-5xl mb-4">🚀</div>
                            <h3 className="text-2xl font-bold mb-3">Always Free</h3>
                            <p className="text-base-content/70">
                                Core features free forever. No credit card required.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
                        <h2 className="text-4xl md:text-5xl font-bold">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-white/90">
                            Join thousands of users creating engaging polls today
                        </p>
                        <Link
                            to="/register"
                            className="btn btn-lg bg-white text-indigo-600 hover:bg-white/90 border-none shadow-xl hover:scale-105 transition-transform gap-2 inline-flex"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                            Create Your First Poll
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-base-300 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                                📊 Polling Platform
                            </div>
                            <p className="text-base-content/60 text-sm mt-1">
                                Making opinion gathering simple and beautiful
                            </p>
                        </div>
                        <div className="flex gap-6">
                            <button
                                onClick={toggleTheme}
                                className="btn btn-ghost btn-circle"
                                aria-label="Toggle theme"
                            >
                                {theme === "light" ? (
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="text-center text-base-content/60 text-sm mt-6">
                        © 2024 Polling Platform. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}
