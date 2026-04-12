#ifndef GL_ES
#version 300 es
#endif
precision highp float;

in vec2 lifecycle;
in vec3 color; // TODO: Support custom colors

out vec4 outColor;

uniform float elapsedTime;
uniform float fadeInTime;
uniform float fadeOutTime;

void main() {
    float timeToLive = lifecycle.x;
    float spawnedAt = lifecycle.y;
    float aliveTime = elapsedTime - spawnedAt;
    if (aliveTime >= (timeToLive + fadeInTime + fadeOutTime) || aliveTime <= 0.0) {
        outColor = vec4(0.0, 0.0, 0.0, 0.0);
        return;
    }

    float alpha = 1.0;
    if (aliveTime <= fadeInTime) {
        alpha = clamp(aliveTime / fadeInTime, 0.0, 1.0);
    } else if (aliveTime >= (timeToLive + fadeInTime)) {
        float fadingOutFor = aliveTime - (timeToLive + fadeInTime);
        alpha = clamp(1.0 - (fadingOutFor / fadeOutTime), 0.0, 1.0);
    }

    // 0xFFFF7F, basically a nice yellow
    outColor = vec4(1.0, 1.0, 0.5, alpha);
}
