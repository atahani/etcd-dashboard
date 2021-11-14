package middlewares

import (
	"net/http"
	"time"

	"golang.org/x/net/context"
)

func WithTimeout(t int16) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			ctx, _ = context.WithTimeout(ctx, time.Duration(t)*time.Second)
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}
