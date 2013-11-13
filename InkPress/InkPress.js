@script ExecuteInEditMode
@script RequireComponent (Camera)
@script AddComponentMenu ("Image Effects/Ink Press")

class InkPress extends PostEffectsBase 
{
	//public var cam : Camera;
	public var inkPressShader : Shader;
	private var _inkPressMaterial : Material = null;	
	private var _timeLapse;

	function CreateMaterials () 
	{		
		if(!_inkPressMaterial) {
			if(!CheckShader(inkPressShader)) {
				enabled = false;
				return;				
			}
			_inkPressMaterial = new Material(inkPressShader);	
		}
	}

	function Start ()
	{
		_timeLapse = 0.0;
		CreateMaterials();
	}
	
	function OnRenderImage2 (source : RenderTexture, destination : RenderTexture)
	{	
		CreateMaterials ();
		
		//Create the blur texture
		var blurEffect : BlurEffect;
		blurEffect = camera.GetComponent("BlurEffect") as BlurEffect;
		if(blurEffect == null)
		{
			blurEffect = camera.gameObject.AddComponent("BlurEffect") as BlurEffect;
			blurEffect.enabled = false;
		}
		blurEffect.iterations = 2;
        blurEffect.blurSpread = 0.4;
        
        //Render to apply the blurring
        var blurTex : RenderTexture = RenderTexture.GetTemporary(source.width, source.height);
		blurEffect.OnRenderImage(source , blurTex);
		
		//Setup the Ink Press effect
		//Set shader blur texture
		_inkPressMaterial.SetTexture("_BlurTex" , blurTex);
		
		//Set shader brightness threshold
		//Threshold starts at 1 and decreases until 0 in [0 , pi/2] interval ("fade out" to white)
		//For (pi/2 , pi], threshold starts at 0 and increases until 1 ("fade in" from white)
		threshold = (_timeLapse <= 1.57079632679 /*half pi*/) ?
			Mathf.Cos(_timeLapse) : -Mathf.Cos(_timeLapse);
		
		_inkPressMaterial.SetFloat("_threshold", threshold);
		
		_timeLapse += 0.01047; //Traverse [0 , pi] interval in 300 steps (5 secs at 60fps)
		
		Graphics.Blit(source, destination, _inkPressMaterial);
		
		RenderTexture.ReleaseTemporary(blurTex);
		
		//Deactivate the effect when animation finishes
		if(_timeLapse > 3.14)
		{
			_timeLapse = 0.0;
			this.enabled = false;
		}
	}
}