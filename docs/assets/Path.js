/**
 * @file Path.js
 * @author Daniel Starke
 * @copyright Copyright 2022-2023 Daniel Starke
 * @date 2022-11-13
 * @version 2023-02-25
 */

/** PathItem instance. Coordinate origin is 0, 0, 0 at the left bottom. */
var PathItem = (function (x = 0, y = 0, z = 0, m = 0) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.m = m;
});
Object.defineProperty(PathItem , "TRAVEL", {
	value: 0,
	writable: false,
	enumerable: true,
	configurable: false
});
Object.defineProperty(PathItem , "TRAVEL_ALWAYS", {
	value: 1,
	writable: false,
	enumerable: true,
	configurable: false
});
Object.defineProperty(PathItem , "ENGRAVE", {
	value: 2,
	writable: false,
	enumerable: true,
	configurable: false
});
Object.defineProperty(PathItem , "CUT", {
	value: 3,
	writable: false,
	enumerable: true,
	configurable: false
});

/** PathWriter instance. */
var Path = (function (x = 0, y = 0, z = 0) {
	this.last = new PathItem(x, y, z);
	this.result = [this.last];

	/**
	 * Returns the boundary box for the complete path.
	 *
	 * @return boundary box
	 */
	this.size = (function () {
		var res = {
			minX: +Infinity,
			minY: +Infinity,
			minZ: +Infinity,
			maxX: -Infinity,
			maxY: -Infinity,
			maxZ: -Infinity
		};
		this.result.forEach(function (item) {
			if ( ! item ) return;
			if (res.minX > item.x) {
				res.minX = item.x;
			}
			if (res.minY > item.y) {
				res.minY = item.y;
			}
			if (res.minZ > item.z) {
				res.minZ = item.z;
			}
			if (res.maxX < item.x) {
				res.maxX = item.x;
			}
			if (res.maxY < item.y) {
				res.maxY = item.y;
			}
			if (res.maxZ < item.z) {
				res.maxZ = item.z;
			}
		});
		return res;
	});

	/**
	 * Adds a new position by the given relative coordinates.
	 *
	 * @param[in,out] obj - object instance
	 * @param[in] x - x coordinate movement
	 * @param[in] y - y coordinate movement
	 * @param[in] z - z coordinate movement
	 * @param[in] m - mode for this line segment
	 */
	var relPoint = (function (obj, x, y, z, m) {
		obj.last = new PathItem(obj.last.x + x, obj.last.y + y, obj.last.z + z, m);
		obj.result.push(obj.last);
	});

	/**
	 * Adds a new position by the given absolute coordinates.
	 *
	 * @param[in,out] obj - object instance
	 * @param[in] x - x coordinate movement
	 * @param[in] y - y coordinate movement
	 * @param[in] z - z coordinate movement
	 * @param[in] m - mode for this line segment
	 */
	var absPoint = (function (obj, x, y, z, m) {
		obj.last = new PathItem(x, y, (z === undefined || isNaN(z)) ? obj.last.z : z, m);
		obj.result.push(obj.last);
	});

	/**
	 * Normalizes the given scale value.
	 *
	 * @param[in] val - scale value to normalize
	 * @return normalized scale value with the fields `x`, `y` and `z`.
	 */
	var normalizeScale = (function (val) {
		if ( isNaN(val) ) {
			var res = {x: 1, y: undefined, z: undefined};
			if ( Array.isArray(val) ) {
				/* from array */
				switch (val.length) {
				case 3:
					res.z = val[2];
				case 2:
					res.y = val[1];
				case 1:
					res.x = val[0];
					break;
				default:
					break;
				}
			} else {
				/* from properties */
				if ( val.hasOwnProperty('x') ) {
					res.x = val.x;
				}
				if ( val.hasOwnProperty('y') ) {
					res.y = val.y;
				}
				if ( val.hasOwnProperty('z') ) {
					res.z = val.z;
				}
			}
			if (res.y === undefined) {
				res.y = res.x;
			}
			if (res.z === undefined) {
				res.z = res.y;
			}
			return res;
		}
		return {x: val, y: val, z: val}; /* from scalar */
	});

	/**
	 * Multiplies the given normalized scale with the passed factor.
	 *
	 * @param[in] val - scale
	 * @param[in] factor - scalar factor
	 * @return modified scale
	 */
	var scaleTimes = (function (val, factor) {
		return {x: val.x * factor, y: val.y * factor, z: val.z * factor};
	});

	/**
	 * Travel by the given relative coordinates.
	 *
	 * @param[in] x - x coordinate movement
	 * @param[in] y - y coordinate movement
	 * @param[in] z - z coordinate movement
	 */
	this.travel = (function (x, y = 0, z = 0) {
		relPoint(this, x, y, z, PathItem.TRAVEL);
	});

	/**
	 * Travel to the given absolute coordinates.
	 *
	 * @param[in] x - new x coordinate
	 * @param[in] y - new y coordinate
	 * @param[in] z - optional (keep old position if `undefined`)
	 */
	this.travelTo = (function (x, y, z = undefined) {
		absPoint(this, x, y, z, PathItem.TRAVEL);
	});

	/**
	 * Travel by the given relative coordinates.
	 * This is a forced travel which will not be optimized away.
	 *
	 * @param[in] x - x coordinate movement
	 * @param[in] y - y coordinate movement
	 * @param[in] z - z coordinate movement
	 */
	this.travelAlways = (function (x, y = 0, z = 0) {
		relPoint(this, x, y, z, PathItem.TRAVEL_ALWAYS);
	});

	/**
	 * Travel to the given absolute coordinates.
	 * This is a forced travel which will not be optimized away.
	 *
	 * @param[in] x - new x coordinate
	 * @param[in] y - new y coordinate
	 * @param[in] z - optional (keep old position if `undefined`)
	 */
	this.travelAlwaysTo = (function (x, y, z = undefined) {
		absPoint(this, x, y, z, PathItem.TRAVEL_ALWAYS);
	});

	/**
	 * Engrave by the given relative coordinates.
	 *
	 * @param[in] x - x coordinate movement
	 * @param[in] y - y coordinate movement
	 * @param[in] z - z coordinate movement
	 */
	this.engrave = (function (x, y = 0, z = 0) {
		relPoint(this, x, y, z, PathItem.ENGRAVE);
	});

	/**
	 * Engrave to the given absolute coordinates.
	 *
	 * @param[in] x - new x coordinate
	 * @param[in] y - new y coordinate
	 * @param[in] z - optional (keep old position if `undefined`)
	 */
	this.engraveTo = (function (x, y, z = undefined) {
		absPoint(this, x, y, z, PathItem.ENGRAVE);
	});

	/**
	 * Cut by the given relative coordinates.
	 *
	 * @param[in] x - x coordinate movement
	 * @param[in] y - y coordinate movement
	 * @param[in] z - z coordinate movement
	 */
	this.cut = (function (x, y = 0, z = 0) {
		relPoint(this, x, y, z, PathItem.CUT);
	});

	/**
	 * Cut to the given absolute coordinates.
	 *
	 * @param[in] x - new x coordinate
	 * @param[in] y - new y coordinate
	 * @param[in] z - optional (keep old position if `undefined`)
	 */
	this.cutTo = (function (x, y, z = undefined) {
		absPoint(this, x, y, z, PathItem.CUT);
	});

	/**
	 * Moves the path by the given offset.
	 *
	 * @param[in] x - offset in x direction
	 * @param[in] y - offset in y direction
	 * @param[in] z - offset in z direction
	 */
	this.move = (function (x = 0, y = 0, z = 0) {
		this.result.forEach(function (item) {
			if ( ! item ) return;
			item.x += x;
			item.y += y;
			item.z += z;
		});
	});

	/**
	 * Scales the path by the given factor.
	 *
	 * @param[in] scale - normalized scaling factor
	 */
	this.scale = (function (scale) {
		this.result.forEach(function (item) {
			if ( ! item ) return;
			item.x *= scale.x;
			item.y *= scale.y;
			item.z *= scale.z;
		});
	});

	/**
	 * Adds the given path at the end of the current path.
	 *
	 * @param[in] path - `Path` object to add
	 */
	this.add = (function (path) {
		var _this = this; /* bind `this` here to access it within `forEach()` */
		path.result.forEach(function (item) {
			if ( ! item ) return;
			_this.last = item;
			_this.result.push(item);
		});
	});

	/**
	 * Adds the given path with the passed offset below the current path.
	 * The current path is moved up by the size of the given path and the
	 * passed spacing.
	 *
	 * @param[in] path - `Path` object to add
	 * @param[in] space - spacing between old and new path in y direction
	 */
	this.addBelow = (function (path, space = 0) {
		this.move(0, space + path.size().maxY);
		this.add(path);
	});

	/**
	 * Creates a path from the given string. The available syntax is
	 * similar to the one of a SVG path as OP x,y with an optional z.
	 * The following operations are possible:
	 * - T - travel to absolute coordinates
	 * - t - travel by relative coordinates
	 * - F - forced travel to absolute coordinates
	 * - f - forced travel by relative coordinates
	 * - E - engrave to absolute coordinates
	 * - e - engrave by relative coordinates
	 * - C - cut to absolute coordinates
	 * - c - cut by relative coordinates
	 *
	 * @param[in] str - path string
	 * @return true on success, false on error
	 */
	this.path = (function (str) {
		var parse = new Parser(str);
		while ( ! parse.end() ) {
			var ch = parse.character();
			var mode = PathItem.TRAVEL;
			var fn = absPoint;
			switch (ch) {
			case 't':
				fn = relPoint;
			case 'T':
				break;
			case 'f':
				fn = relPoint;
				mode = PathItem.TRAVEL_ALWAYS;
			case 'F':
				break;
			case 'e':
				fn = relPoint;
			case 'E':
				mode = PathItem.ENGRAVE;
				break;
			case 'c':
				fn = relPoint;
			case 'C':
				mode = PathItem.CUT;
				break;
			default:
				return false;
			}
			var x = parse.number();
			if (x === undefined) {
				return false;
			}
			if (parse.character(',') === undefined) {
				return false;
			}
			var y = parse.number();
			if (y === undefined) {
				return false;
			}
			if (parse.character(',') !== undefined) {
				var z = parse.number();
				if (z !== undefined) {
					fn(this, x, y, z, mode);
				} else {
					fn(this, x, y, (fn == absPoint) ? NaN : 0, mode);
				}
			} else {
				fn(this, x, y, (fn == absPoint) ? NaN : 0, mode);
			}
		}
		return parse.end();
	});

	/**
	 * Adds a character at the given scale and position.
	 *
	 * @param[in] ch - character to add (e.g. '1')
	 * @param[in] scale - character scale, normal is 1
	 * @param[in] x - offset in x direction
	 * @param[in] y - offset in y direction
	 * @param[in] z - offset in z direction
	 */
	this.addChar = (function (ch, scale, x = 0, y = 0, z = 0) {
		var path = new Path;
		switch (ch) {
		case '0':
			path.path("T4,2 E6,2 E7,3 E7,8 E6,9 E4,9 E3,8 E3,3 E4,2");
			break;
		case '1':
			path.path("T3,2 E7,2 T5,2 E5,9 E4,8");
			break;
		case '2':
			path.path("T7, 2 E3,2 E3,3 E7,7 E7,8 E6,9 E4,9 E3,8");
			break;
		case '3':
			path.path("T3,3 E4,2 E6,2 E7,3 E7,5 E6,6 E5,6 T6,6 E7,7 E7,8 E6,9 E4,9 E3,8");
			break;
		case '4':
			path.path("T5,2 E5,6 T7,4 E2,4 E2,5 E6,9");
			break;
		case '5':
			path.path("T3,3 E4,2 E6,2 E7,3 E7,5 E6,6 E3,6 E3,9 E7,9");
			break;
		case '6':
			path.path("T6,9 E6,9 E4,9 E3,8 E3,3 E4,2 E6,2 E7,3 E7,5 E6,6 E3,6");
			break;
		case '7':
			path.path("T5,2 E7,9 E3,9 E3,7");
			break;
		case '8':
			path.path("T4,2 E6,2 E7,3 E7,5 E6,6 E4,6 E3,7 E3,8 E4,9 E6,9 E7,8 E7,7 E6,6 T4,6 E3,5 E3,3 E4,2");
			break;
		case '9':
			path.path("T4,2 E6,2 E7,3 E7,8 E6,9 E4,9 E3,8 E3,6 E4,5 E7,5");
			break;
		case '.':
			path.path("T4,2 E5,2 E5,3 E4,3 E4,2");
			break;
		case '-':
			path.path("T4,4.5 E7,4.5");
			break;
		case 'B':
			path.path("T3,1 E6,1 E7,2 E7,4 E6,5 E3,5 T6,5 E7,6 E7,7 E6,8 E3,8 E3,1");
			break;
		case 'F':
			path.path("T3,1 E3,8 E7,8 T3,5 E6,5");
			break;
		case 'S':
			path.path("T3,2 E4,1 E6,1 E7,2 E7,4 E6,5 E4,5 E3,6 E3,7 E4,8 E6,8 E7,7");
			break;
		case 'X':
			path.path("T2,1 E7,8 T7,1 E2,8");
			break;
		case 'Y':
			path.path("T4.5,1 E4.5,4 E7,8 T4.5,4 E2,8");
			break;
		case 'Z':
			path.path("T7,1 E2,1 E7,8 E2,8");
			break;
		default:
			/* space */
			break;
		}
		path.move(0.5, 0.5);
		path.scale(scaleTimes(normalizeScale(scale), 0.1));
		path.move(x, y, z);
		this.add(path);
	});

	/**
	 * Adds a string at the given scale and position.
	 *
	 * @param[in] str - string to add
	 * @param[in] scale - character scale, normal is 1
	 * @param[in] x - offset in x direction
	 * @param[in] y - offset in y direction
	 * @param[in] z - offset in z direction
	 */
	this.addStr = (function (str, scale, x = 0, y = 0, z = 0) {
		var column = 0;
		var row = 0;
		var nScale = normalizeScale(scale);
		for (var i = 0; i < str.length; i++) {
			switch (str[i]) {
			case '\r': /* ignore carrier-return */
				break;
			case '\n':
				column = 0;
				row++;
				break;
			default:
				this.addChar(str[i], nScale, x + (column * nScale.x), y + (row * nScale.y), z);
				column++;
				break;
			}
		}
	});

	/**
	 * Mirrors the path vertically at the X axis.
	 */
	this.flipY = (function () {
		var maxY = this.size().maxY;
		this.result.forEach(function (item) {
			if ( ! item ) return;
			item.y = maxY - item.y;
		});
	});

	/**
	 * Perform simple path optimizations.
	 */
	this.optimize = (function () {
		var path = new Path;
		var last = null;
		var traveling = false;
		var sameItem = (function (a, b) {
			return a.x == b.x && a.y == b.y && a.z == b.z && a.m == b.m;
		});
		this.result.forEach(function (item) {
			if ( ! item ) return;
			if ( last ) {
				/* combine multi-travel moves and skip duplicate items */
				if (item.m == PathItem.TRAVEL) {
					traveling = true;
				} else if ( ! sameItem(last, item) ) {
					if ( traveling ) {
						absPoint(path, last.x, last.y, last.z, last.m);
						traveling = false;
					}
					absPoint(path, item.x, item.y, item.z, item.m);
				}
			} else {
				path.last = item;
				path.result[0] = item;
			}
			last = item;
		});
		this.last = path.last;
		this.result = path.result;
	});
});
