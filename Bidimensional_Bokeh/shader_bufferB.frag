precision mediump float;

// screen filling texture
uniform sampler2D uSampler;

varying vec2 vTextureCoord;

#define USE_RANDOM

const vec2 blurdir = vec2( 1.0, -0.577350269189626 );

// ===

const float blurdist_px = 32.0;
const int NUM_SAMPLES = 16;

const float THRESHOLD = 0.1;
const float MULT = 2.0;

uniform vec3 iResolution; // The viewport resolution (z is pixel aspect ratio, usually 1.0)
uniform float iTime;	// Current time in seconds

#define GAMMA_SRGB
vec3 srgb2lin( vec3 cs )
{
	vec3 c_lo = cs / 12.92;
	vec3 c_hi = pow( (cs + 0.055) / 1.055, vec3(2.4) );
	vec3 s = step(vec3(0.04045), cs);
	return mix( c_lo, c_hi, s );
}
vec3 lin2srgb( vec3 cl )
{
	//cl = clamp(cl, 0.0, 1.0);
	vec3 c_lo = 12.92 * cl;
	vec3 c_hi = 1.055 * pow(cl, vec3(0.41666)) - 0.055;
	vec3 s = step( vec3(0.0031308), cl);
	return mix( c_lo, c_hi, s);
}
#else
vec3 srgb2lin(vec3 c) { return c*c };
vec3 lin2srgb(vec3 c) { return sqrt(c) };
#endif //GAMMA_SRGB

//note uniform pdf rand [0;1[
float hash12n(vec2 p)
{
	p = fract(p * vec2(5.3987, 5.4421));
	p += dot(p.yx, p.xy + vec2(21.5351, 14.3137));
	return fract(p.x * p.y * 95.4307);
}

vec4 pattern( vec2 p )
{
	float aspect = iResolution.xy/iResolution.y;
	float p0 = step(abs(p.x-0.125), 0.01) * step(abs(p.y-0.27), 0.01);
	float p1 = step( length(p-vec2(0.125, 0.45) ), 0.025 );

	float p2_0 = step( length( p - vec2(0.08, 0.14) ), 0.0125);
	float p2_1 = step( length( p-vec2(0.16, 0.125) ), 0.0125);
	float p2_2 = step( length( p-vec2(0.1, 0.07) ), 0.0125);
	float p2 = max(p2_0, max(p2_1, p2_2));

	return vec4( max( p0, max(p1, p2) ) );
}

vec3 sampletex( vec2 uv )
{
	return srgb2lin( texture2D(uSampler, uv, -10.0).rgb );
}

void main(void) {
	vec2 blurvec = normalize(blurdir) / iResolution.xx;
	vec2 suv = gl_FragCoord.xy / iResolution.xy;
	vec2 uv = gl_FragCoord.xy / iResolution.xx;
	float sinblur = ( 0.55 + 0.45 * sin( 5.0 * uv.x + iTime ) );

	vec2 p0 = uv;
	vec2 p1 = uv + blurdist * blurvec;
	vec2 stepvec = (p1-p0) / float(NUM_SAMPLES);
	vec2 p = p0;
	#if defined(USE_RANDOM)
	p += (hash12n(uv+fract(iTime)+0.2)) * stepvec;
	#endif

	vec3 sumcol = vec3(0.0);
	for (int i=0; i<NUM_SAMPLES;++i)
	{
		if (p.x < 0.25)
		{
			suncol += pattern( p ).rgb;
		}else {
			vec3 smpl = (sampletex(p) - THRESHOLD ) / (1.0 - THRESHOLD);
			//sumcol += sample;
			sumcol += smpl*smpl;
		}

		p += stepvec;
	}
	sumcol /= float(NUM_SAMPLES);
	sumcol = max( sumcol, 0.0 );

	gl_FragColor = vec4( lin2srgb( sumcol * MULT ), 1.0 );
}
