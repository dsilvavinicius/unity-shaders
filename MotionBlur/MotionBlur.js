@script ExecuteInEditMode
@script RequireComponent (Camera)
@script AddComponentMenu ("Image Effects/Motion Blur")

class MotionBlur extends PostEffectsBase 
{
	public var motionBlurShader : Shader;
	private var _motionBlurMaterial : Material = null;
	private var _previousViewProjectionMatrix : Matrix4x4;

	function CreateMaterials () 
	{		
		if(!_motionBlurMaterial) {
			if(!CheckShader(motionBlurShader)) {
				enabled = false;
				return;				
			}
			_motionBlurMaterial = new Material(motionBlurShader);	
		}
		if(!SystemInfo.SupportsRenderTextureFormat (RenderTextureFormat.Depth)) {
			enabled = false;
			return;	
		}
	}

	function Start ()
	{
		CreateMaterials();
		previousViewProjectionMatrix = camera.projectionMatrix * camera.worldToCameraMatrix;
	}
	
	function OnEnable () {
		camera.depthTextureMode = DepthTextureMode.Depth;	
	}
	
	function OnRenderImage2 (source : RenderTexture, destination : RenderTexture)
	{	
		CreateMaterials ();
		
		//Set shader uniform values
		//Calculate invere model-view-projection matrix
		var viewProjection : Matrix4x4 = camera.projectionMatrix * camera.worldToCameraMatrix;
		var inverseViewProjection : Matrix4x4 = viewProjection.inverse;
		
		_motionBlurMaterial.SetFloat("_intensity" , 0.03);
		_motionBlurMaterial.SetMatrix("_inverseViewProjectionMatrix" , inverseViewProjection);
		_motionBlurMaterial.SetMatrix("_previousViewProjectionMatrix" , _previousViewProjectionMatrix);
		
		Graphics.Blit(source, destination, _motionBlurMaterial);
		
		//Set previous projection matrix for next blur
		_previousViewProjectionMatrix = viewProjection;
	}
}