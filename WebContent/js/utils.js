export const RATING_MAX = 5;
export const DATE_FORMAT_SHORT = 'D.M.YYYY';
export const DATE_FORMAT_DISPLAY_LONG = 'Do MMMM YYYY';
export const LOCATION = 'de';

/**
 * 
 */
export function addTextToBody(text) {
  const div = document.createElement('div');
  div.textContent = text;
  document.body.appendChild(div);
}

export function getQueryVar(varName){
    // Grab and unescape the query string - appending an '&' keeps the RegExp simple
    // for the sake of this example.
    var queryStr = unescape(window.location.search) + '&';

    // Dynamic replacement RegExp
    var regex = new RegExp('.*?[&\\?]' + varName + '=(.*?)&.*');

    // Apply RegExp to the query string
    var val = queryStr.replace(regex, "$1");

    // If the string is the same, we didn't find a match - return false
    return val == queryStr ? false : val;
}


export function getFormatedDateLong (date){
	if (!moment(date).isValid()){
		return ""
	}
	return moment(date).locale(LOCATION).format(DATE_FORMAT_DISPLAY_LONG);
}
export function getFormatedDateShort (date){
	if (!moment(date).isValid()){
		return ""
	}
	return moment(date).locale(LOCATION).format(DATE_FORMAT_SHORT);
}

export function cutText(text, numberOfLine) {
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

export function getDaysRemining (date){
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

export function getDaysPased (date){
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