const fetch = require("node-fetch")
const cheerio = require("cheerio")

const lambda = async (event, context) => {
  const seller = event.queryStringParameters.seller
  if (seller === undefined) {
    return { statusCode: 404, body: "" }
  }
  const request = await fetch(
    "https://www.cardmarket.com/en/Magic/Users/" + seller
  )
  const data = await request.text()
  let $ = cheerio.load(data)
  let q = 0
  $("h3.card-title").each(function(i, elem) {
    //console.log(i);
    //console.log(elem);
    let $quantity = $("span.bracketed", this).text()
    q = $quantity
  }) // end each()
  //console.log(retObject);
  const stringified = JSON.stringify({ seller: seller, nbcards: q })
  return { statusCode: 200, body: stringified }
}

/*lambda({ queryStringParameters: { seller: "twika" } }).then(data =>
  console.log(data)
)*/

exports.handler = lambda
