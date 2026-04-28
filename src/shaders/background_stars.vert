#ifndef GL_ES
#version 300 es
#endif

in vec3 position;
in mat4 instanceMatrix;
in vec2 inLifecycle;
in vec3 inColor;

out vec2 lifecycle;
out vec3 color;

uniform vec2 viewport;
uniform float elapsedTime;
uniform float rotationSpeed;
uniform float fadeInTime;
uniform float fadeOutTime;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

mat2 angle2rot(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(
        c, -s,
        s, c
    );
}

float calculate_scale() {
    float timeToLive = lifecycle.x;
    float spawnedAt = lifecycle.y;
    float aliveTime = elapsedTime - spawnedAt;

    if (aliveTime <= fadeInTime) {
        return clamp(aliveTime / fadeInTime, 0.0, 1.0);
    } 
    
    if (aliveTime >= (timeToLive + fadeInTime)) {
        float fadingOutFor = aliveTime - (timeToLive + fadeInTime);
        return clamp(1.0 - (fadingOutFor / fadeOutTime), 0.0, 1.0);
    }

    return 1.0;
}

void main() {
    lifecycle = inLifecycle;
    vec3 pos = position;
    pos.xy *= angle2rot(elapsedTime * rotationSpeed);

    mat4 scaledMatrix = instanceMatrix;
    scaledMatrix[3].xy *= viewport * 0.5;

    float scale = calculate_scale();
    gl_Position = projectionMatrix * modelViewMatrix * scaledMatrix * vec4(pos * scale, 1.0);
}
