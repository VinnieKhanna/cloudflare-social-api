import { Router } from 'itty-router'



const router = Router()

router.get("/", () => {
  return new Response("Home rendered here.")
})

router.get("/posts", async () => {
  var posts = []
  const keys = await datastore.list()
  console.log(keys.keys)
  for (let key of keys.keys) {
    console.log(key.name)
    posts.push(await datastore.get(key.name))
  }
  console.log(posts)
  //const keys = await datastore.list()
  //await datastore.put("post1", JSON.stringify({"title" : "first post on this site!!", "content" : "this is my first post..pretty boring"}))
  return new Response(posts)
})

/*
Try the below curl command to send JSON:
$ curl -X POST <worker> -H "Content-Type: application/json" -d '{"abc": "def"}'
*/
router.post("/posts", async request => {
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
Render 404 for all other (unknown) routes
*/
router.all("*", () => new Response("404, not found!", { status: 404 }))

/*
Pass all incoming requests to the router
*/
addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request))
})


// const mf = new Miniflare({
//   script: `
//   addEventListener("fetch", (event) => {
//     event.respondWith(router.handle(event.request));
//   });
//   `,
// });
// const res = await mf.dispatchFetch("http://localhost:8787/");