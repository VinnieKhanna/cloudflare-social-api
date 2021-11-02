import { Router } from 'itty-router'

const router = Router()

router.get("/", () => {
  return new Response("Home rendered here.")
})

router.get("/posts", async () => {
  const key = await datastore.get("user")
  console.log(key)
  //const keys = await datastore.list()
  //await datastore.put("user", JSON.stringify({"key1" : "val1", "key2" : "val2"}))
  return new Response(key)
})

/*
This route demonstrates path parameters, allowing you to extract fragments from the request
URL.
Try visit /example/hello and see the response.
*/
router.get("/example/:text", ({ params }) => {
  // Decode text like "Hello%20world" into "Hello world"
  let input = decodeURIComponent(params.text)

  return new Response(``, {
    headers: {
      "Content-Type": "text/html"
    }
  })
})

/*
This shows a different HTTP method, a POST.
Try send a POST request using curl or another tool.
Try the below curl command to send JSON:
$ curl -X POST <worker> -H "Content-Type: application/json" -d '{"abc": "def"}'
*/
router.post("/post", async request => {
  // Create a base object with some fields.
  let fields = {
    "asn": request.cf.asn,
    "colo": request.cf.colo
  }

  // If the POST data is JSON then attach it to our response.
  if (request.headers.get("Content-Type") === "application/json") {
    fields["json"] = await request.json()
  }

  // Serialise the JSON to a string.
  const returnData = JSON.stringify(fields, null, 2);

  return new Response(returnData, {
    headers: {
      "Content-Type": "application/json"
    }
  })
})

/*
Render 404 for all other (unknown) routes
*/
router.all("*", () => new Response("404, not found!", { status: 404 }))

/*
Pass all incoming requests to the router
*/
addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request))
})

