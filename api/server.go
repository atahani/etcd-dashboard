package main

import (
	"fmt"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/atahani/etcd-dashboard/api/config"
	"github.com/atahani/etcd-dashboard/api/etcd"
	"github.com/atahani/etcd-dashboard/api/graph"
	"github.com/atahani/etcd-dashboard/api/graph/generated"
	"github.com/atahani/etcd-dashboard/api/logger"
	"github.com/atahani/etcd-dashboard/api/middlewares"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
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

	// initial the etcd helper
	etcd := etcd.NewEtcd(conf, logger)

	// configure graphql server
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{
		Conf:   conf,
		Logger: logger,
		Etcd:   etcd,
	},
		Directives: graph.MakeDirectives(),
	}))
	sm := mux.NewRouter()
	sm.Use(cors.New(cors.Options{
		AllowedOrigins:   conf.ClientEndpoints,
		AllowCredentials: true,
	}).Handler)
	sm.Use(middlewares.WithTimeout(conf.Timeout))
	sm.Use(middlewares.WithCookie(conf.JWTSignKey))

	sm.Handle("/", playground.Handler("GraphQL playground", "/query"))
	sm.Handle("/query", srv)

	logger.Printf("connect to http://localhost:%d/ for GraphQL playground", conf.Port)
	logger.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", conf.Port), sm))
}
