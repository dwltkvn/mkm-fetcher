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
  $("h3.card-title").each(function(i, elem) {
    //console.log(i);
    //console.log(elem);
    let $quantity = $("span.bracketed", this).text()
    let seller = "Uraktus"
    let object = {
      quantity: $quantity,
      seller: seller,
    }
    q = $quantity
    retObject[i] = object
  }) // end each()
  //console.log(retObject);
  return { statusCode: 200, body: q }
}

//lambda().then(data => console.log(data))

exports.handler = lambda
