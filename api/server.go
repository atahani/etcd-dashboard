package main

import (
	"fmt"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/atahani/etcd-dashboard/api/config"
	"github.com/atahani/etcd-dashboard/api/graph"
	"github.com/atahani/etcd-dashboard/api/graph/generated"
	"github.com/atahani/etcd-dashboard/api/logger"
	"github.com/sirupsen/logrus"
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

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	logger.Printf("connect to http://localhost:%d/ for GraphQL playground", conf.Port)
	logger.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", conf.Port), nil))
}
