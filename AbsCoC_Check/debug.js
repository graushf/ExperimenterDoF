float GatherAndApply(Texture2D textureSampler, float2 uv, float baseCoC, float4 currCol, float stepDistance, out float4 outCol)
        {
            outColor = currCol;
            float4 col = textureSampler.Sample(linearSampler, uv);

            // CoC < 0 means the pixel is in front of the focal plane
            bool blurNear = col.w < 0.0;
            float absCoC = abs(col.w);

            // Check if the CoC of the sampled pixel is big enough to scatter here, and 
            // the sampled pixel is in front of the focal plane or
            // this pixel is behind the focal plane and the sampled pixel isn't too far behind it.
            if ((absCoC > stepDistance) && (blurNear || (baseCoC > 0.0 && absCoC < baseCoC * 2.0))) 
            {
                // Sort out the CoC of the blurred image, by tacking to biggest CoC to maintain the hexagon
                // shape in the second pass.
                // Near-blurred pixels should continue to blur over far pixels. Far pixels don't blur over
                // near pixels so that case can be ignored.
                if (blurNear) 
                {
                    if (outCol.w < 0.0) {
                        // This pixel is already near-blurred, so see if the sampled CoC is any bigger
                        outCol.w = min(outCol.w, col.w);
                    }
                    else 
                    {
                        // this pixel is behind the focal plane, so only continue with the near-blur if that is 
                        // stronger. Going to get artifacts either way on depth edges with different coloured
                        // pixels
                        if (-col.w > outCol.w) 
                        {
                            outCol.w = col.w;
                        }
                    }
                }

                // Now accumulate the colour. Allow partial sampling at the pixel boundary for smoothness.
                float sampleFraction = saturate((absCoC - stepDistance) / OneOverScreenHeight);
                if (((col.x + col.y + col.z)/3.0) > 0.8) {
                    col.xyz *= 1000000;
                }
                //col.xyz *= 100000000000000;
                outCol.xyz += sampleFraction * col.xyz;

                return sampleFraction;
            }

            // No colour added.
            return 0.0;
        }



        BlurOutput BlurPass1(PSInput input) {
            BlurOutput output;

            // Start by sampling at the centre of the blur
            float4 baseColour = texture0.Sample(linearSampler, input.uv);

            // Final coulour and CoC size will be accumulated in the output.
            output.col0 = float4(0.0, 0.0, 0.0, baseColour.w);
            output.col1 = float4(0.0, 0.0, 0.0, baseColour.w);

            // Sample over the full extent to fake our pseudo-scatter. Keep count of how much of each sample was added.
            float sampleCount0 = 0.0;
            float sampleCount1 = 0.0;

            // Diagonal blur step, corrected for aspect ratio.
            float xStep = 0.866 * (OneOverScreenWidth/OneOverScreenHeight);

            for (int i = 0; i < 8; i++) {
                float stepDistance = (i + 0.5) * OneOverScreenHeight;

                // Vertical blur 
                float2 step0 = float2(0.0, 1.0) * stepDistance;
                sampleCount0 += GatherAndApply(texture0, input.uv + step0, baseColour.w, output.col0, stepDistance, output.col0);

                // Diagonal blur
                float2 step1 = float2(xStep, -0.5) * stepDistance;
                sampleCount1 += GatherAndApply(texture0, input.uv + step1, baseColour.w, output.col1, stepDistance, output.col1);
            }

            // Normalise if any color was added.
            output.col0.xyz = sampleCount0 > 0 ? (output.col0.xyz / sampleCount0) : baseColour.xyz;
            output.col1.xyz = sampleCount1 > 0 ? (output.col1.xyz / sampleCount1) : baseColour.xyz;


            // The second render target contains both of these added together. Don't divide it by two here,
            // as it'll be combined again and divided by three in the next pass.
            output.col1.xyz += output.col0.xyz;

            // For the combined term, set the CoC to the blurriest of the two inputs.
            if (abs(output.col0.w) > abs(output.col1.w)) 
            {
                output.col1.w = output.col0.w;
            }

            return output;
        }