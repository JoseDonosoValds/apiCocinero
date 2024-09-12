const {Router} = require("express")
const {getDataJoin} = require("../controllers/getDataJoin")
const { postDataJoin } = require("../controllers/postDataJoin");
const { getMesa } = require("../controllers/getMesa");
const { getProduct } = require("../controllers/getProduct");
const { getWaiters } = require("../controllers/getWaiter");
/* const { getMesa }=require("../controllers/getWaiter.js"); */
const router=Router();






router.get("/mesa",getMesa)
router.get("/product",getProduct)
router.get("/join",getDataJoin)
router.get("/waiter",getWaiters)

router.post('/finalizarPedido/:idPedido',postDataJoin)
module.exports = router;