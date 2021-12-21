package constant

var HeaderCtxKey = &contextKey{"httpHeader"}
var IsSystemCtxKey = &contextKey{"fromSystem"}
var EtcdTokenCtxKey = &contextKey{"user.etcdToken"}
var UserRolesCtxKey = &contextKey{"user.roles"}
var UsernameCtxKey = &contextKey{"user.username"}
var SessionKeyCookieName = "session"

type contextKey struct {
	name string
}

var TagsKey = "tags"
