const fetch = require("node-fetch")
const cheerio = require("cheerio")

const lambda = async (event, context) => {
  const request = await fetch(
    "https://www.cardmarket.com/en/Magic/Users/Uraktus"
  )
  const data = await request.text()
  let $ = cheerio.load(data)
  let retObject = {}
  let q = 0
  let u = ""
  $("h3.card-title").each(function(i, elem) {
    //console.log(i);
    //console.log(elem);
    let $quantity = $("span.bracketed", this).text()
    let seller = "Uraktus"
    let object = {
      quantity: $quantity,
      seller: seller,
    }
    retObject[i] = object
    q = $quantity
    u = seller
  }) // end each()
  //console.log(retObject);
  const stringified = JSON.stringify({ seller: u, nbcards: q })
  return { statusCode: 200, body: stringified }
}

//lambda().then(data => console.log(data))

exports.handler = lambda
