import { linkForce, xForce, yForce, gravity, circleCollide } from "./forces";
			.force("link", linkForce)
			.force("forceX", xForce)
			.force("forceY", yForce)
			.force("gravity", () => gravity(-10000))
			.force("collide", circleCollide)
