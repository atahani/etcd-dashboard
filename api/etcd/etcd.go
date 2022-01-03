package etcd

import (
	"context"
	"fmt"
	"time"

	"github.com/atahani/etcd-dashboard/api/config"
	"github.com/atahani/etcd-dashboard/api/constant"
	"github.com/sirupsen/logrus"
	clientv3 "go.etcd.io/etcd/client/v3"
	"go.etcd.io/etcd/client/v3/credentials"
	"google.golang.org/grpc"
	"google.golang.org/grpc/status"
)

type Etcd struct {
	Conf   *config.Env
	Logger *logrus.Logger
}

func NewEtcd(c *config.Env, l *logrus.Logger) *Etcd {
	return &Etcd{Conf: c, Logger: l}
}

func (e *Etcd) GetClientWithoutAuth() (*clientv3.Client, error) {
	cli, err := clientv3.New(clientv3.Config{
		Endpoints:   e.Conf.EtcdEndpoints,
		DialTimeout: 5 * time.Second,
	})
	if err != nil {
		if ok, err := e.ProcessCommonError(err); ok {
			return nil, err
		}
		msg := "failed to create new etcd client without authentication"
		e.Logger.WithField("EtcdEndpoints", e.Conf.EtcdEndpoints).WithError(err).Error(msg)
		return nil, fmt.Errorf(msg)
	}
	return cli, nil
}

func (e *Etcd) GetClientAsRoot() (*clientv3.Client, error) {
	cli, err := clientv3.New(clientv3.Config{
		Endpoints:   e.Conf.EtcdEndpoints,
		DialTimeout: 5 * time.Second,
		Username:    "root",
		Password:    e.Conf.EtcdRootPassword,
	})
	if err != nil {
		if ok, err := e.ProcessCommonError(err); ok {
			return nil, err
		}
		msg := "failed to create new etcd client as Root"
		e.Logger.WithField("EtcdEndpoints", e.Conf.EtcdEndpoints).WithError(err).Error(msg)
		return nil, fmt.Errorf(msg)
	}
	return cli, nil
}

func (e *Etcd) GetClient(ctx context.Context) (*clientv3.Client, error) {
	if ctx.Value(constant.IsSystemCtxKey) != nil {
		return e.GetClientAsRoot()
	}
	if ctx.Value(constant.EtcdTokenCtxKey) == nil {
		return nil, fmt.Errorf("token is not provided")
	}
	token := ctx.Value(constant.EtcdTokenCtxKey).(string)
	c := credentials.NewBundle(credentials.Config{})
	c.UpdateAuthToken(token)
	cli, err := clientv3.New(clientv3.Config{
		Endpoints:   e.Conf.EtcdEndpoints,
		DialTimeout: 5 * time.Second,
		DialOptions: []grpc.DialOption{grpc.WithPerRPCCredentials(c.PerRPCCredentials())},
	})
	if err != nil {
		if ok, err := e.ProcessCommonError(err); ok {
			return nil, err
		}
		msg := "failed to create new etcd client with context"
		e.Logger.WithField("EtcdEndpoints", e.Conf.EtcdEndpoints).WithError(err).Error(msg)
		return nil, fmt.Errorf(msg)
	}
	return cli, nil
}

func (e *Etcd) ProcessCommonError(err error) (bool, error) {
	if err == context.Canceled {
		return true, fmt.Errorf("context cancenled")
	}
	if err == context.DeadlineExceeded || err == grpc.ErrClientConnTimeout || err == grpc.ErrClientConnClosing || err == grpc.ErrServerStopped {
		return true, fmt.Errorf("etcd timeout")
	}
	if status.Convert(err).Message() == "auth: revision in header is old" {
		// after any update on auth state, like adding role, or chaning the permission
		// the auth revion header will be change, and if it's old
		// the user should re authorized
		return true, fmt.Errorf("access denied")
	}
	return false, nil
}
