export const RATING_MAX = 5;
export const DATE_FORMAT_SHORT = 'D.M.YYYY';
export const DATE_FORMAT_DISPLAY_LONG = 'Do MMMM YYYY';
export const LOCATION = 'de';

/**
 * Utils class
 */
export class Utils {

	/**
	 * Querys the given var name
	 * @param varName the name to query
	 * @returns {*}
	 */
	static getQueryVar(varName){
		// Grab and unescape the query string - appending an '&' keeps the RegExp simple
		// for the sake of this example.
		let queryStr = unescape(window.location.search) + '&';

		// Dynamic replacement RegExp
		let regex = new RegExp('.*?[&\\?]' + varName + '=(.*?)&.*');

		// Apply RegExp to the query string
		let val = queryStr.replace(regex, "$1");

		// If the string is the same, we didn't find a match - return false
		return val == queryStr ? false : val;
	}

	/**
	 * Switch the style sheet to the given style path. The
	 * setting will also be stored to the local storage so
	 * the next time the client start the app the selected
	 * style will appear.
	 *
	 * @param styleSheet the stylesheet node to switch
	 * @param styleButton the button holding the selected style path
	 */
	static switchStyle (styleSheet, styleButton) {
		styleSheet.href = styleButton.options[styleButton.selectedIndex].value;
		let stylez = JSON.stringify({ buttonValue: styleButton.value, stylePath: styleSheet.href });
		localStorage.setItem("stylez", stylez);
	}

	/**
	 * Loads the last selecte style form local storage.
	 *
	 * @param styleSheet
	 * @param styleButton the button holding the selected style path
	 */
	static loadStyle(styleSheet, styleButton){
		if (localStorage.getItem("stylez")) {
			let stylez = JSON.parse(localStorage.getItem("stylez"));
			styleSheet.href = stylez.stylePath;
			if (styleButton) {
				styleButton.value = stylez.buttonValue;
			}
		}
	}

	/**
	 * Returns the given date in configured display format
	 * @param date The date to format
	 * @returns {string} The formated date
	 */
	static getFormatedDateLong (date){
		if (!moment(date).isValid()){
			return ""
		}
		return moment(date).locale(LOCATION).format(DATE_FORMAT_DISPLAY_LONG);
	}

	/**
	 * Returns the given date in short display format
	 * @param date The date to format
	 * @returns {string} The formated date
	 */
	static getFormatedDateShort (date){
		if (!moment(date).isValid()){
			return ""
		}
		return moment(date).locale(LOCATION).format(DATE_FORMAT_SHORT);
	}

	/**
	 * Cuts the given text after the fiven number of line
	 * @param text The text to cut
	 * @param numberOfLine The number of lines after the text will be cut
	 * @returns {string} The new text
	 */
	static cutText(text, numberOfLine) {
		let lines = text.split('\n')
		let temp = ""
		lines.forEach((line, i) => {
			if (i<numberOfLine && line.length > 0){
				if (i>0) {temp += '<br/>'};
				temp += line
			};
		})
		if (lines.length > numberOfLine) {temp += "[...]"};
		return temp;
	}

	/**
	 * Calculates the remaining days form now
	 * @param date The due date
	 * @returns {*} The Utils.formated remining days
	 */
	static getDaysRemining (date){
		let end = moment(date).add(1, 'days');
		if (!end.isValid()) {
			return "end someday";
		}
		if (end.diff(moment(), 'days') == 0) {
			return "due today";
		} else if (end.diff(moment(), 'days') == 1) {
			return "due tomorrow";
		} else if (end.diff(moment(), 'weeks') == 0) {
			return "due next " + end.format("dddd");
		}
		return "due " + end.fromNow();
	}

	/**
	 * Calculates the passed days from now
	 * @param date The done date
	 * @returns {*} The formated passed days
	 */
	static getDaysPased (date){
		let end = moment(date);
		if (!end.isValid()) {
			return "undefined";
		}
		if (moment().diff(end, 'days') == 0) {
			return "finised today";
		} else if (end.diff(moment(), 'days') == -1) {
			return "finised yesterday";
		} else if (end.diff(moment(), 'weeks') == 0) {
			return "finisched last " + end.format("dddd");
		}
		return "finisched " + end.fromNow();
	}

    /**
	 * Returns the login header used for ajax
     * @returns {Headers}
     */
	static loginHeader(token){
        let myHeaders = new Headers();
        myHeaders.append("authorization", "Bearer " + token);
		return myHeaders;
	}
	/**
	 * Sends an ajax request to the given url and returns the result
	 * @param method The method of the request [POST, GET, DELETE]
	 * @param url The url to send the request to
	 * @param data The date to send
	 * @param headers The headers to add
	 */
	static ajax (method, url, data, headers){
        let myHeaders = new Headers(headers);
        if (data) {
            myHeaders.append('Content-Type', 'application/json');
        }

        let myInit = {
            method: method,
            headers: myHeaders,
            body: data ?  JSON.stringify(data) : undefined
        }

        return fetch(url,myInit).then(function (response) {
            var contentType = response.headers.get("content-type");
            if(contentType && contentType.includes("application/json")) {
                return response.json();
            } else {
            	return response;
			}
        })
	}
}
