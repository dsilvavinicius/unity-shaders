Shader "Custom/InkPress"
{
	Properties
	{
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_BlurTex ("Base (RGB)", 2D) = "white" {}
	}
	SubShader
	{
		Pass
		{
			//Usual post processing setup
			ZTest Always Cull Off ZWrite Off
		  	Fog { Mode off }
	  	
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			#pragma target 2.0
			
			#include "UnityCG.cginc"
			
			struct v2f {
				float4 pos : POSITION;
				float2 uv : TEXCOORD0;
			};
			
			v2f vert (appdata_img v)
			{
			    v2f o;
				o.pos = mul(UNITY_MATRIX_MVP, v.vertex);
				o.uv = v.texcoord.xy;
				return o;
			}
			
			sampler2D _MainTex;
			sampler2D _BlurTex;
			float _threshold;
			
			float4 frag( v2f v ) : COLOR
			{
			    // Step 1: Get the brightness of the blur texture
			    float2 vUv = v.uv;
			    float4 returnColour = float4(1.0 , 1.0 , 1.0 , 1.0);
			    float3 texColour = tex2D(_BlurTex , v.uv).xyz;
			    float bright = (texColour.r + texColour.g + texColour.b) / 3.0;
			    
			    //Step 2: Return the main texture pixel colour if its brightness is bellow
			    //the threshold. Clear the pixel otherwise.
			    if(bright < _threshold)
			    {
			    	returnColour = tex2D(_MainTex , v.uv);
			    }
			    
			    return returnColour;
			}
			ENDCG
		}
	} 
	FallBack "Diffuse"
}