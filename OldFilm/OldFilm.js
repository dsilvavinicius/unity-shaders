@script ExecuteInEditMode
@script RequireComponent (Camera)
@script AddComponentMenu ("Image Effects/Old Camera")

class OldFilm extends PostEffectsBase 
{
	public var oldCameraShader : Shader;
	private var _oldCameraMaterial : Material = null;	
	private var _timeLapse;
	private var _vignettingValue;

	function CreateMaterials () 
	{		
		if(!_oldCameraMaterial) {
			if(!CheckShader(oldCameraShader)) {
				enabled = false;
				return;				
			}
			_oldCameraMaterial = new Material(oldCameraShader);	
		}
	}

	function Start ()
	{
		_timeLapse = 0.0;
		_vignettingValue = 0.6;
		CreateMaterials();
	}
	
	function OnRenderImage2 (source : RenderTexture, destination : RenderTexture)
	{	
		CreateMaterials ();
		
		//Set shader uniform values
		_oldCameraMaterial.SetFloat("SepiaValue", 0.3);
		_oldCameraMaterial.SetFloat("NoiseValue", 0.3);
		_oldCameraMaterial.SetFloat("ScratchValue", 0.3);
		
		_oldCameraMaterial.SetFloat("InnerVignetting", 1.0 - _vignettingValue);
		_oldCameraMaterial.SetFloat("OuterVignetting", 1.4 - _vignettingValue);
		
		var rnd = Random.value;
		_oldCameraMaterial.SetFloat("RandomValue", rnd);
		
		_timeLapse += 1.0;
		_oldCameraMaterial.SetFloat("TimeLapse", _timeLapse);
		
		Graphics.Blit(source, destination, _oldCameraMaterial);
	}
}