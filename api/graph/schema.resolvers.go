package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/atahani/etcd-dashboard/api/constant"
	"github.com/atahani/etcd-dashboard/api/data"
	"github.com/atahani/etcd-dashboard/api/graph/generated"
	"github.com/atahani/etcd-dashboard/api/graph/model"
	jwt "github.com/dgrijalva/jwt-go"
	genPass "github.com/sethvargo/go-password/password"
	"github.com/sirupsen/logrus"
	clientv3 "go.etcd.io/etcd/client/v3"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (r *mutationsResolver) Initialize(ctx context.Context) (*model.InitializeResult, error) {
	cli, err := r.Etcd.GetClientWithoutAuth()
	if err != nil {
		return nil, err
	}
	defer cli.Close()
	// check the auth status
	authStatus, err := cli.Auth.AuthStatus(ctx)
	if err != nil {
		if ok, err := r.Etcd.ProcessCommonError(err); ok {
			return nil, err
		}
		// return unknown error on -> "etcdserver: user name is empty"
		if status.Code(err) == codes.Unknown {
			// means needs Username and Password
			return nil, fmt.Errorf("etcd authentication is enabled and already initialized")
		}
		msg := "etcd -> AuthStatus failed"
		r.Logger.WithError(err).Error(msg)
		return nil, fmt.Errorf("%s -> %s", msg, err)
	}
	if authStatus.Enabled {
		return nil, fmt.Errorf("etcd authentication is enabled and already initialized")
	}
	// 1. add role
	// before enabling the authentication needs to add root role and root user
	rootRole := "root"
	_, err = r.Mutations().AddRole(ctx, rootRole)
	if err != nil {
		return nil, err
	}
	// 2. add root user
	roles := []*string{&rootRole}
	rootUsername := "root"
	rootUserRes, err := r.Mutations().AddUser(ctx, model.AddUserInput{Username: rootUsername, Roles: roles, Password: &r.Conf.EtcdRootPassword})
	if err != nil {
		return nil, err
	}
	// 3. add admin user
	adminUsername := "admin"
	adminUserRes, err := r.Mutations().AddUser(ctx, model.AddUserInput{Username: adminUsername, Roles: roles})
	if err != nil {
		return nil, err
	}
	// 4. now we can enable the authentication mode
	_, err = cli.Auth.AuthEnable(ctx)
	if err != nil {
		if ok, err := r.Etcd.ProcessCommonError(err); ok {
			return nil, err
		}
		msg := "etcd -> AuthEnable failed"
		r.Logger.WithError(err).Error(msg)
		return nil, fmt.Errorf("%s -> %s", msg, err)
	}
	if err != nil {
		r.Logger.WithField("EtcdEndpoints", r.Conf.EtcdEndpoints).WithError(err).Error("something went wrong while connecting to etcd")
	}
	return &model.InitializeResult{
		RootPassword:  rootUserRes.Password,
		AdminPassword: adminUserRes.Password,
	}, nil
}

func (r *mutationsResolver) AddRole(ctx context.Context, name string) (bool, error) {
	cli, err := r.Etcd.GetClient(ctx)
	if err != nil {
		return false, err
	}
	defer cli.Close()
	_, err = cli.Auth.RoleAdd(ctx, name)
	if err != nil {
		if ok, err := r.Etcd.ProcessCommonError(err); ok {
			return false, err
		}
		msg := "something went wrong while adding new role, name=%s"
		r.Logger.WithError(err).Errorf(msg, name)
		return false, fmt.Errorf(msg, name)
	}
	return true, nil
}

func (r *mutationsResolver) AssignRoleToUser(ctx context.Context, username string, role string) (bool, error) {
	cli, err := r.Etcd.GetClient(ctx)
	if err != nil {
		return false, err
	}
	defer cli.Close()
	_, err = cli.UserGrantRole(ctx, username, role)
	if err != nil {
		if ok, err := r.Etcd.ProcessCommonError(err); ok {
			return false, err
		}
		msg := "something went wrong while assigning %s role to %s user"
		r.Logger.WithError(err).Errorf(msg, role, username)
		return false, fmt.Errorf(msg, role, username)
	}
	return true, nil
}

func (r *mutationsResolver) AddUser(ctx context.Context, data model.AddUserInput) (*model.AddUserResult, error) {
	cli, err := r.Etcd.GetClient(ctx)
	if err != nil {
		return nil, err
	}
	defer cli.Close()
	// 1. generate the password if not pass on the input
	var password string
	if data.Password != nil {
		password = *data.Password
	} else {
		password, err = genPass.Generate(16, 5, 2, false, false)
		if err != nil {
			msg := fmt.Sprintf("something went wrong while generating the passsword for %s user", data.Username)
			r.Logger.WithError(err).Errorf(msg)
			return nil, fmt.Errorf(msg)
		}
	}
	// 2. add the user to the etcd users
	_, err = cli.Auth.UserAdd(ctx, data.Username, password)
	if err != nil {
		if ok, err := r.Etcd.ProcessCommonError(err); ok {
			return nil, err
		}
		r.Logger.WithError(err).WithFields(logrus.Fields{
			"name":           data.Username,
			"passwordLength": len(password),
		}).Error("Mutation -> AddUser")
		return nil, fmt.Errorf("something went wrong while creating the user with %s name", data.Username)
	}
	// 3. assing roles to the new user
	for _, role := range data.Roles {
		_, err := r.AssignRoleToUser(ctx, data.Username, *role)
		if err != nil {
			return nil, err
		}
	}
	return &model.AddUserResult{
		Password: password,
	}, nil
}

func (r *mutationsResolver) GrantPermission(ctx context.Context, data model.GrantPermissionInput) (bool, error) {
	cli, err := r.Etcd.GetClient(ctx)
	if err != nil {
		return false, err
	}
	defer cli.Close()
	var permType clientv3.PermissionType
	if data.Read && data.Write {
		permType = clientv3.PermissionType(clientv3.PermReadWrite)
	} else if data.Write {
		permType = clientv3.PermissionType(clientv3.PermWrite)
	} else {
		permType = clientv3.PermissionType(clientv3.PermRead)
	}
	_, err = cli.RoleGrantPermission(ctx, data.Role, data.Key, data.RangeEnd, permType)
	if err != nil {
		if ok, err := r.Etcd.ProcessCommonError(err); ok {
			return false, err
		}
		msg := "something went wrong while grant permission for a role"
		r.Logger.WithField("input", data).WithError(err).Error(msg)
		return false, fmt.Errorf(msg)
	}
	return true, nil
}

func (r *mutationsResolver) Login(ctx context.Context, username string, password string) (*model.LoginResult, error) {
	// since we need root permission to query the roles get client as ROOT
	cli, err := r.Etcd.GetClientWithoutAuth()
	if err != nil {
		return nil, err
	}
	defer cli.Close()
	res, err := cli.Auth.Authenticate(ctx, username, password)
	if err != nil {
		if ok, err := r.Etcd.ProcessCommonError(err); ok {
			return nil, err
		}
		if strings.Contains(err.Error(), "authentication failed") {
			return nil, fmt.Errorf("username or password is incorrect")
		}
		r.Logger.WithError(err).WithFields(logrus.Fields{
			"name":           username,
			"passwordLength": len(password),
		}).Error("Mutation -> Login")
		return nil, fmt.Errorf("something went wrong while authentication of %s", username)
	}
	// set system key since we need ROOT access on some of queries
	ctx = context.WithValue(ctx, constant.IsSystemCtxKey, true)
	// get roles of user
	roles, err := r.Queries().Roles(ctx, &username)
	if err != nil {
		return nil, err
	}
	// get the permissions which belongs to this user
	permissions, err := r.Queries().Permissions(ctx, nil, &username)
	if err != nil {
		return nil, err
	}
	// generate the jwt token
	claims := data.CustomClaims{
		Token:    res.Token,
		Username: username,
		Roles:    roles,
	}
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	st, err := t.SignedString([]byte(r.Conf.JWTSignKey))
	if err != nil {
		msg := "failed on signing the jwt token"
		r.Logger.WithError(err).Error(msg)
		return nil, fmt.Errorf(msg)
	}
	du := time.Minute * time.Duration(r.Conf.EtcdJwtTTLMin-2)
	expiredAt := time.Now().Add(du)
	// set the jwt token as cookie
	cookie := &http.Cookie{Name: constant.SessionKeyCookieName, Value: st, HttpOnly: true, Path: "/query", SameSite: http.SameSiteDefaultMode, Expires: expiredAt}
	headers := ctx.Value(constant.HeaderCtxKey).(http.Header)
	headers.Add("Set-Cookie", cookie.String())
	return &model.LoginResult{
		Username:    username,
		Roles:       roles,
		Permissions: permissions,
	}, nil
}

func (r *mutationsResolver) Logout(ctx context.Context) (bool, error) {
	// should remove the cookie
	headers := ctx.Value(constant.HeaderCtxKey).(http.Header)
	cookie := &http.Cookie{Name: constant.SessionKeyCookieName, Value: "", HttpOnly: true, Path: "/query", SameSite: http.SameSiteDefaultMode, MaxAge: -1}
	headers.Add("Set-Cookie", cookie.String())
	return true, nil
}

func (r *mutationsResolver) Put(ctx context.Context, data model.PutInput) (*model.PutResult, error) {
	cli, err := r.Etcd.GetClient(ctx)
	if err != nil {
		return nil, err
	}
	defer cli.Close()
	if data.TTL != nil && *data.TTL > 5 {
		// create a new lease
		resp, err := cli.Grant(ctx, int64(*data.TTL))
		if err != nil {
			if ok, err := r.Etcd.ProcessCommonError(err); ok {
				return nil, err
			}
			msg := "failed to create a new lease"
			r.Logger.WithError(err).Error(msg)
			return nil, fmt.Errorf(msg)
		}
		// put the key with lease
		res, err := cli.Put(ctx, data.Key, data.Value, clientv3.WithLease(resp.ID))
		if err != nil {
			if ok, err := r.Etcd.ProcessCommonError(err); ok {
				return nil, err
			}
			msg := "failed to put the key %s"
			r.Logger.WithError(err).Errorf(msg, data.Key)
			return nil, fmt.Errorf(msg, data.Key)
		}
		lId := int(resp.ID)
		return &model.PutResult{
			Revision: int(res.Header.Revision),
			LeaseID:  &lId,
		}, nil
	}
	res, err := cli.Put(ctx, data.Key, data.Value)
	if err != nil {
		if ok, err := r.Etcd.ProcessCommonError(err); ok {
			return nil, err
		}
		msg := "failed to put the key %s"
		r.Logger.WithError(err).Errorf(msg, data.Key)
		return nil, fmt.Errorf(msg, data.Key)
	}
	return &model.PutResult{
		Revision: int(res.Header.Revision),
	}, nil
}

func (r *queriesResolver) Users(ctx context.Context) ([]string, error) {
	cli, err := r.Etcd.GetClient(ctx)
	if err != nil {
		return nil, err
	}
	defer cli.Close()
	res, err := cli.Auth.UserList(ctx)
	if err != nil {
		if ok, err := r.Etcd.ProcessCommonError(err); ok {
			return nil, err
		}
		msg := "something went wrong while getting user list"
		r.Logger.WithError(err).Error(msg)
		return nil, fmt.Errorf(msg)
	}
	return res.Users, nil
}

func (r *queriesResolver) Roles(ctx context.Context, username *string) ([]string, error) {
	cli, err := r.Etcd.GetClient(ctx)
	if err != nil {
		return nil, err
	}
	defer cli.Close()
	var roles []string
	if username != nil {
		res, err := cli.UserGet(ctx, *username)
		if err != nil {
			if ok, err := r.Etcd.ProcessCommonError(err); ok {
				return nil, err
			}
			msg := "something went wrong while getting user info"
			r.Logger.WithField("username", username).WithError(err).Error(msg)
			return nil, fmt.Errorf(msg)
		}
		roles = res.Roles
	} else {
		res, err := cli.Auth.RoleList(ctx)
		if err != nil {
			if ok, err := r.Etcd.ProcessCommonError(err); ok {
				return nil, err
			}
			msg := "something went wrong while getting role list"
			r.Logger.WithError(err).Error(msg)
			return nil, fmt.Errorf(msg)
		}
		roles = res.Roles
	}
	return roles, nil
}

func (r *queriesResolver) Permissions(ctx context.Context, role *string, username *string) ([]*model.RolePermission, error) {
	cli, err := r.Etcd.GetClient(ctx)
	if err != nil {
		return nil, err
	}
	defer cli.Close()
	if role != nil {
		res, err := cli.RoleGet(ctx, *role)
		if err != nil {
			if ok, err := r.Etcd.ProcessCommonError(err); ok {
				return nil, err
			}
			msg := "something went wrong while getting the %s role"
			r.Logger.WithError(err).Errorf(msg, role)
			return nil, fmt.Errorf(msg, role)
		}
		result := make([]*model.RolePermission, len(res.Perm))
		for index, per := range res.Perm {
			write, read := per.PermType == clientv3.PermWrite, per.PermType == clientv3.PermRead
			if per.PermType == clientv3.PermReadWrite {
				write, read = true, true
			}
			result[index] = &model.RolePermission{
				Key:      string(per.Key),
				RangeEnd: string(per.RangeEnd),
				Write:    write,
				Read:     read,
			}
		}
		return result, nil
	}
	if username != nil {
		roles, err := r.Queries().Roles(ctx, username)
		if err != nil {
			return nil, err
		}
		var results []*model.RolePermission
		for _, role := range roles {
			res, err := r.Queries().Permissions(ctx, &role, nil)
			if err != nil {
				return nil, err
			}
			results = append(results, res...)
		}
		return results, nil
	}
	return nil, fmt.Errorf("should pass at least one of the role or username")
}

func (r *queriesResolver) Get(ctx context.Context, key string) ([]*model.KeyValue, error) {
	cli, err := r.Etcd.GetClient(ctx)
	if err != nil {
		return nil, err
	}
	defer cli.Close()
	res, err := cli.Get(ctx, key)
	if err != nil {
		if ok, err := r.Etcd.ProcessCommonError(err); ok {
			return nil, err
		}
		r.Logger.WithError(err).Error("Query -> get")
		return nil, err
	}
	keysValues := []*model.KeyValue{}
	for _, kv := range res.Kvs {
		keysValues = append(keysValues, &model.KeyValue{
			Key:   string(kv.Key),
			Value: string(kv.Value),
		})
	}
	return keysValues, nil
}

// Mutations returns generated.MutationsResolver implementation.
func (r *Resolver) Mutations() generated.MutationsResolver { return &mutationsResolver{r} }

// Queries returns generated.QueriesResolver implementation.
func (r *Resolver) Queries() generated.QueriesResolver { return &queriesResolver{r} }

type mutationsResolver struct{ *Resolver }
type queriesResolver struct{ *Resolver }
