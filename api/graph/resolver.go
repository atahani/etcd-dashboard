package graph

import (
	"github.com/atahani/etcd-dashboard/api/config"
	"github.com/atahani/etcd-dashboard/api/etcd"
	"github.com/sirupsen/logrus"
)

//go:generate go run github.com/99designs/gqlgen

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	Etcd   *etcd.Etcd
	Conf   *config.Env
	Logger *logrus.Logger
}
