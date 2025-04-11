package models

import (
	"database/sql"
	"time"
)

type List struct {
	ID        string    `json:"id"`
	OwnerID   int       `json:"owner_id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	Groups    []Group   `json:"groups"`
}

type Group struct {
	ID        string    `json:"id"`
	ListID    int       `json:"list_id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	Gifts     []Gift    `json:"gifts"`
}

type Gift struct {
	ID          string    `json:"id"`
	GroupID     int       `json:"group_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	Gotten      bool      `json:"gotten"`
}
