router = new nails.RegExpRouter()
router.match('/').to controller: 'Todos', action: 'index'

router.resource 'todos'
exports.router = router

