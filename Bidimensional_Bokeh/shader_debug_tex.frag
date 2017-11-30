precision mediump float;

//uniform vec3 iResolution;
uniform float iTime;

uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;

// the texCoords passed in from the vertex shader
varying vec2 vTextureCoord;

vec3 srgb2lin(vec3 c) { return c*c; }

vec3 sampletex(vec2 uv) 
{
    float t = fract( 0.1 * iTime);
    //float t = 0.80;
    if (t < 1.0/3.0) 
        return  srgb2lin( texture2D(iChannel0, uv, -10.0).rgb  );
    else if (t < 2.0/3.0)
        return srgb2lin( texture2D(iChannel1, uv, -10.0).rgb  );
    else
        return srgb2lin( texture2D(iChannel2, uv, -10.0).rgb  );
}

void main(void) {

    
    gl_FragColor = vec4(sampletex(vec2(vTextureCoord.x,  vTextureCoord.y)), 1.0);
    //gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);




}

vec3 FragCoordsToNDC() {
    // Converrt (x, y, z) to [0, 1] range
    float x = gl_FragCoord.x/iResolution.x;
    float y = gl_FragCoord.y/iResolution.y;
    float z = gl_FragCoord.z;   // Already in range [0, 1];

    // Convert the range [0, 1] to NDC [-1,1]
    float ndcx = x * 2.0 - 1.0;
    float ndcy = y * 2.0 - 1.0;
    float ndcz = z * 2.0 - 1.0;
    vec3 ndc = vec3(ndcx, ndcy, ndcz);

    return vec3(x, y, z);
}