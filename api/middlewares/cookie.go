package middlewares

import (
	"context"
	"net/http"

	"github.com/atahani/etcd-dashboard/api/constant"
	"github.com/atahani/etcd-dashboard/api/data"
	"github.com/dgrijalva/jwt-go"
)

func WithCookie(jwtSignKey string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			// you don't need to pass the entire response writer, under the hood, the SetCookie method only sets a header, which is a map, we can attach the header to the context without having to attach the entire response writer
			ctx = context.WithValue(ctx, constant.HeaderCtxKey, w.Header())
			// check the session cookie which contain the JWT token
			session, err := r.Cookie(constant.SessionKeyCookieName)
			if err == nil {
				claims := &data.CustomClaims{}
				_, err := jwt.ParseWithClaims(session.Value, claims, func(t *jwt.Token) (interface{}, error) {
					return []byte(jwtSignKey), nil
				})
				if err == nil {
					ctx = context.WithValue(ctx, constant.UsernameCtxKey, claims.Username)
					ctx = context.WithValue(ctx, constant.EtcdTokenCtxKey, claims.Token)
					ctx = context.WithValue(ctx, constant.UserRolesCtxKey, claims.Roles)
				}
			}
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

func HasRole(ctx context.Context, role string) bool {
	if roles, ok := ctx.Value(constant.UserRolesCtxKey).([]string); ok {
		for _, v := range roles {
			if v == role {
				return true
			}
		}
	}
	return false
}
