const crypto = require('crypto') 
 
/** 
* All the supported hash algorithms 
*/ 
const supported_hash_algo = [ 
  "md5", 
  "sha1", 
  "sha256", 
  "sha512", 
  "ripemd160" 
] 
 
/** 
  * hash 
  * @desc Returns hash result 
  * @param {String} data - Data for hash calculation 
  * @param {String} hashAlgo - Hash algorithm, must match "supported_hash_algo" 
  * @return {String} 
  * @example 
  * const hash = digest("sha256", 'a') 
  */ 
exports.hash = function(hashAlgo, data) { 
  if (supported_hash_algo.indexOf(hashAlgo) < 0) 
    throw TypeError('Expected a supported hash algorithm') 
     
  return crypto.createHash(hashAlgo).update(data).digest() 
}