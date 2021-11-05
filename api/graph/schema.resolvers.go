package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/atahani/etcd-dashboard/api/graph/generated"
	"github.com/atahani/etcd-dashboard/api/graph/model"
)

func (r *mutationsResolver) Put(ctx context.Context, key string, value string) (int, error) {
	res, err := r.EtcdCli.Put(ctx, key, value)
	if err != nil {
		r.Logger.WithError(err).Error("Mutation -> Put")
		return 0, err
	}
	return int(res.Header.Revision), nil
}

func (r *queriesResolver) Get(ctx context.Context, key string) ([]*model.KeyValue, error) {
	res, err := r.EtcdCli.Get(ctx, key)
	if err != nil {
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
