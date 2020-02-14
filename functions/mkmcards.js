const fetch = require("node-fetch")
const cheerio = require("cheerio")

const lambda = async (event, context) => {
  const card = event.queryStringParameters.card
  let lang = event.queryStringParameters.lang
  if (card === undefined) {
    return { statusCode: 404, body: "nop" }
  }
  if (lang === undefined) {
    lang = "fr"
  }
  const request = await fetch(
    "https://www.cardmarket.com/" + lang + "/Magic/Cards/" + card,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body:
        "sellerCountry%5B12%5D=12&sellerReputation=5&maxShippingTime=7&minCondition=7&extra%5BisFoil%5D=0&extra%5BisSigned%5D=0&extra%5BisPlayset%5D=0&extra%5BisAltered%5D=0&amount=0&apply=Filtrer",
      //"sellerCountry%5B12%5D=12&sellerReputation=1&maxShippingTime=7&minCondition=7&extra%5BisFoil%5D=0&extra%5BisSigned%5D=0&extra%5BisPlayset%5D=0&extra%5BisAltered%5D=0&amount=0&apply=Filtrer",
    }
  )
  const data = await request.text()
  let $ = cheerio.load(data)
  let seller = ""
  let price = 0
  let rawstr = ""
  //div > ul > li:nth-child(1) > a > div > h3
  //$("span.seller-name > span > a").each(function(i, elem) {
  //$("div.table-body > div").each(function(i, elem) {
  $(".table-body > div.article-row").each(function(i, elem) {
    //$("h3.card-title").each(function(i, elem) {
    //console.log(i);
    //console.log(elem);

    //let $quantity = $("span.seller-name", this).text()
    let $txt = $(this).text()

    rawstr = $txt
    let str = $txt.split(" ")
    if (str.length < 3) return false

    seller = str[0]
    price = str[2].substr(1).replace(",", ".")

    return false
    //console.log(i + " : " + q + " --- ")
  }) // end each()
  //console.log(retObject);
  const stringified = JSON.stringify({
    card: card,
    seller: seller,
    price: price,
    raw: rawstr,
  })
  return { statusCode: 200, body: stringified }
}

lambda({ queryStringParameters: { card: "Tempete-de-mille-ans" } }).then(data =>
  console.log(data)
)

exports.handler = lambda
