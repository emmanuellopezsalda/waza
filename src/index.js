import server from "./server.js";

server.listen(server.get("port"), () => {
    console.log(`http://localhost:${server.get("port")}`);
})
