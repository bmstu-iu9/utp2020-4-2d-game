#type vertex

attribute vec2 a_Position;
attribute vec4 a_Color;
attribute vec2 a_TexCoords;

uniform mat3 u_ViewProjectionMatrix;

varying vec4 v_Color;
varying vec2 v_TexCoords;

void main() {
	v_Color = a_Color;
	v_TexCoords = a_TexCoords;
	gl_Position = vec4(u_ViewProjectionMatrix * vec3(a_Position, 1.0), 1.0);
}

#type fragment

precision mediump float;

uniform sampler2D u_Texture;

varying vec4 v_Color;
varying vec2 v_TexCoords;

void main() {
	vec4 texColor = texture2D(u_Texture, v_TexCoords);
	gl_FragColor = texColor * v_Color;
}
