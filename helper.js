
function parseBufferToJsObject(buffer) {
  return JSON.parse(buffer.toString('utf-8'))
}


module.exports = { parseBufferToJsObject };