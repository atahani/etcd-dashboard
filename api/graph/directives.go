package graph

import (
	"context"
	"fmt"
	"strings"

	"github.com/99designs/gqlgen/graphql"
	"github.com/atahani/etcd-dashboard/api/constant"
	"github.com/atahani/etcd-dashboard/api/graph/generated"
	"github.com/atahani/etcd-dashboard/api/graph/model"
)

func MakeDirectives() generated.DirectiveRoot {
	return generated.DirectiveRoot{
		HasRole: func(ctx context.Context, obj interface{}, next graphql.Resolver, role model.Role) (res interface{}, err error) {
			if ctx.Value(constant.UserRolesCtxKey) != nil {
				roles := ctx.Value(constant.UserRolesCtxKey).([]string)
				for _, role := range roles {
					if strings.ToLower(role) == role {
						return next(ctx)
					}
				}
			}
			return nil, fmt.Errorf("access denied")
		},
	}
}
