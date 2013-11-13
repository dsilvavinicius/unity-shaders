using UnityEngine;
using System.Collections;

public class Sweep : MonoBehaviour {
	
	public float _speed;
	
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		Projector proj = gameObject.GetComponent("Projector") as Projector;
		float fof = proj.fieldOfView;
		proj.fieldOfView = (fof <= 180.0f) ? fof + _speed: 5.0f;
	}
}
