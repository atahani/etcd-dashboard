package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/atahani/etcd-dashboard/api/config"
	"github.com/atahani/etcd-dashboard/api/graph"
	"github.com/atahani/etcd-dashboard/api/graph/generated"
	"github.com/atahani/etcd-dashboard/api/logger"
	"github.com/sirupsen/logrus"
	clientv3 "go.etcd.io/etcd/client/v3"
)

var GitCommit string
var GitTag string

func main() {
	// get config from env vars
	conf, err := config.GetConfig()
	if err != nil {
		logrus.WithError(err).Fatal("Failed to load application config")
	}

	// assing the version
	conf.Version = GitCommit
	if GitTag != "" {
		conf.Version = GitTag
	}

	// initial the logger
	logger := logger.New(conf)

	// initial the etcd client
	cli, err := clientv3.New(clientv3.Config{
		Endpoints:   conf.EtcdEndpoints,
		DialTimeout: 5 * time.Second,
	})
	if err != nil {
		logger.WithField("EtcdEndpoints", conf.EtcdEndpoints).WithError(err).Error("something went wrong while connecting to etcd")
	}
	defer cli.Close()

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	logger.Printf("connect to http://localhost:%d/ for GraphQL playground", conf.Port)
	logger.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", conf.Port), nil))
}
