import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    images: {
        remotePatterns: [
            new URL('https://cdn.discordapp.com/avatars/*/*'),
            { // URL syntax doesnt work with params :(
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                pathname: "/u/*",
            },
        ]
    },
    turbopack: {
        rules: {
            '*': {
                condition: {
                    all: [
                        { not: "foreign" },
                        { path: /\.(glsl|vert|tesc|tese|geom|frag|comp)$/ },
                    ]
                },
                loaders: [require.resolve("./src/loaders/shader-loader.js")],
                as: '*.js'
            },
        }
    },
    cacheComponents: true,
};

export default nextConfig;
