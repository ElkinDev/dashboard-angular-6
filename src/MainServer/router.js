
const exporty={
	server: (req, res)=>{
		if(req.url==='/upPrqForm')
			extraServer.upPrqForm(req, res)
		else if(req.url.indexOf('.well-known/')>-1)
			req.pipe(filed(consts.dirIntra+'/public/'+decodeURI(req.url))).pipe(res)
		else if(req.url.match(/(\/public\/)/g))
			req.pipe(filed(consts.dirIntra+decodeURI(req.url))).pipe(res)
		else if(req.url.match(/(testPayu)/g))
			extraServer.testPayu(req, res)
		else if(req.url.match(/confirmBuy/g))
			extraServer.confirmBuy(req, res)
		else
			res.end('not found')
	}
}
module.exports=exporty