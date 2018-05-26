/**
 * Generate random number or string
 * @param {*} type: can be "number" or "string"
 * @param {*} length: string length or number range
 * 
 */
exports.randomGenerate = function (type, length){
    if(type === 'mber') {
        return Math.floor(Math.random() * Math.floor(length))
    } else if(type == 'string') {
        return getRandomString(length)
    }
}

/**
 * Generate random string
 * @param {*} length: string length
 * 
 */
function getRandomString(length){
    let quotient = Math.floor(length/11)
    let remainder = length % 11
    let result = []

    for(let i = 0; i < quotient; i++){
        result.push(Math.random().toString(36).substring(2, 13))
    }
	
    result.push(Math.random().toString(36).substring(2, remainder + 2))
	
    while(result.join('').length < length){
        result.push(verifyRandomStringLength(result.join(''), length))
    }
	
    return result.join('')
}

/**
 * Sometimes if we run getRandomString(13), only 12 chars are generated, this function is to compensate the missing chars
 * @param {*} string: previously random generated string
 * @param {*} length: the missing chars length
 * 
 */
function verifyRandomStringLength(string, length){
    if(string.length < length){
        let diff = length - string.length
        return getRandomString(diff)
    }
}