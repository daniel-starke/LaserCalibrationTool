/**
 * @file Parser.js
 * @author Daniel Starke
 * @copyright Copyright 2023 Daniel Starke
 * @date 2023-02-14
 * @version 2023-02-19
 */

/** Parser instance. */
var Parser = (function (str) {
	this.string = str;
	this.index = 0;

	/**
	 * Skip function. Skips over whitespaces by default but
	 * may be replaced by a user function.
	 *
	 * @return true if skipped, else false
	 * @remark This function should not use any other parsing
	 * function to avoid infinite recursion.
	 */
	this.skipper = (function () {
		var result = false;
		while (this.index < this.string.length) {
			if (this.string[this.index].trim() === "") {
				result = true;
				this.index++;
			} else {
				break;
			}
		}
		return result;
	});

	/**
	 * Returns whether the end of the string has been reached.
	 *
	 * @return true if end of string, else false
	 */
	this.end = (function () {
		this.skipper();
		return this.index >= this.string.length;
	});

	/**
	 * Returns the next character.
	 *
	 * @param[in] match - optional character that must match
	 * @return the parsed character or `undefined`
	 */
	this.character = (function (match) {
		this.skipper();
		if ( this.end() ) {
			return undefined;
		}
		if (match === undefined) {
			return this.string[this.index++];
		}
		var ch = this.string[this.index];
		if (ch == match) {
			this.index++;
			return ch;
		}
		return undefined;
	});

	/**
	 * Returns the next decimal number.
	 *
	 * @return the parsed number or `undefined`
	 */
	this.number = (function () {
		this.skipper();
		var sign = "";
		var num = "";
		var hasDot = false;
		if ( ! this.end() ) {
			var ch = this.string[this.index];
			if ("-+".indexOf(ch) > -1) {
				num += ch;
				this.index++;
			}
		}
		while ( ! this.end() ) {
			var ch = this.string[this.index];
			if ( hasDot ) {
				if ("0123456789".indexOf(ch) > -1) {
					num += ch;
				} else {
					break;
				}
			} else if (".0123456789".indexOf(ch) > -1) {
				num += ch;
				if (ch == ".") {
					hasDot = true;
				}
			} else {
				break;
			}
			this.index++;
		}
		if (num.length == 0) {
			return undefined;
		}
		return parseFloat(sign + num);
	});
});
