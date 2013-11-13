using UnityEngine;
using System.Collections;

public class DetectiveEffect : MonoBehaviour {
	
	public Shader EffectShader;
	
	// Use this for initialization
	void Start () {
		this.camera.SetReplacementShader(EffectShader, "RenderType");
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
