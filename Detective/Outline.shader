Shader "Custom/Outline" {
Properties {
	_Color ("Main Color", Color) = (.5,.5,.5,1)
    _OutlineColor ("Outline Color", Color) = (1,0,0,1)
    _Outline ("Outline width", Range (0.0, 0.1)) = .05
	_SpecColor ("Specular Color", Color) = (0.5, 0.5, 0.5, 1)
	_Shininess ("Shininess", Range (0.03, 1)) = 0.078125
	_MainTex ("Base (RGB) Gloss (A)", 2D) = "white" {}
}

SubShader {
	//Tags { "RenderType"="Opaque" }
	Tags { "RenderType"="Background" }
	Pass {
		Name "OUTLINE"
		Tags { "LightMode" = "Always" }
		
		Cull Front
		ZWrite On
		// Uncomment to show outline always.
		//ZTest Always
		
		CGPROGRAM
		#pragma target 3.0
		#pragma vertex vert
		#pragma fragment frag
		
		#include "UnityCG.cginc" 
		
		struct appdata {
	    	float4 vertex : POSITION;
		    float3 normal : NORMAL;
		};
		
		struct v2f
		{
		    float4 pos : POSITION;
		    float4 color : COLOR;
		};
		
		float _Outline;
		float4 _OutlineColor;

		v2f vert(appdata v) {
		    // just make a copy of incoming vertex data but scaled according to normal direction
			v2f o;
			o.pos = mul(UNITY_MATRIX_MVP, v.vertex);
		
			float3 norm   = mul ((float3x3)UNITY_MATRIX_IT_MV, v.normal);
			float2 offset = TransformViewToProjection(norm.xy);
		
			o.pos.xy += offset * o.pos.z * 0.004;
			o.color = float4(1,0,0,1);
			return o;
		}
		
		float4 frag(v2f fromVert) : COLOR {
			return fromVert.color;
		}
		ENDCG
    }
    UsePass "RenderFX/Skybox"
    //UsePass "Bumped Specular/FORWARD"
}

//Subshader {
//	Tags { "RenderType"="TransparentCutout" }
//	UsePass "Outline/OUTLINE"
//	UsePass "Transparent/Cutout/Specular/FORWARD"
//}

//FallBack "Specular"
}
