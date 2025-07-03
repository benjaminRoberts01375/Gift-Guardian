package main

import (
	"context"
	"math/rand"
	"time"
)

type CacheEntryDuration time.Duration

const (
	passwordSet CacheEntryDuration = CacheEntryDuration(time.Minute * 15)
	userJWT                        = CacheEntryDuration(UserJWTDuration)
)

func createCacheEntry(key string, value string, duration CacheEntryDuration) error {
	ctx := context.Background()
	// Only set the cache if the value doesn't already exist in the cache (NX)
	return cache.Do(ctx, cache.B().Set().Key(key).Value(value).Nx().Ex(time.Duration(duration)).Build()).Error()
}

func getCacheEntry(key string) (string, error) {
	ctx := context.Background()
	return cache.Do(ctx, cache.B().Get().Key(key).Build()).ToString()
}

func getAndDeleteCacheEntry(key string) (string, error) {
	ctx := context.Background()
	result, err := cache.Do(ctx, cache.B().Get().Key(key).Build()).ToString()
	if err != nil {
		return "", err
	}
	err = cache.Do(ctx, cache.B().Del().Key(key).Build()).Error()
	if err != nil {
		return "", err
	}
	return result, nil
}

func cacheResetPassword(userID string) (string, error) {
	// TODO: Check if the resetID already exists in the cache and generate a new one if it does
	resetID := generateRandomString(16)
	return resetID, createCacheEntry(resetID, userID, passwordSet)
}

func generateRandomString(length int) string {
	// Charset is URL safe and easy to read
	const charset = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789"

	stringBase := make([]byte, length)
	for i := range stringBase {
		stringBase[i] = charset[rand.Intn(len(charset))]
	}
	return string(stringBase)
}
